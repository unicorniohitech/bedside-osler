import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CircleCheck, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ToolPanel } from '../layout/ToolPanel'
import { ToolRail } from '../layout/ToolRail'
import { TOOL_COMPONENTS } from '../tools'
import type { ToolId } from '../tools/registry'
import { Button } from '../ui/Button'
import { Dialog, dialogIconClass } from '../ui/Dialog'
import { isCapture } from '@/lib/capture'
import { formatDateTime, formatDay } from '@/lib/dates'
import { groupByStatus, noteStatus } from '@/lib/noteStatus'
import { displayName } from '@/lib/patient'
import { useIsMobile } from '@/lib/useIsMobile'
import { api } from '@/services/api'
import type { Evolution, Note, NoteBlock, PatientListItem } from '@/types'
import { NoteEditor, type EditorApi } from './NoteEditor'
import { NoteReadOnly } from './NoteReadOnly'
import { PcSheet } from './PcSheet'
import { TodayPatients } from './TodayPatients'
import s from './Workspace.module.css'

const PANEL_PARAM: Record<string, ToolId> = {
  history: 'history',
  companion: 'companion',
  handoff: 'handoff',
  flowchart: 'flowchart',
  cid: 'cid',
  calc: 'calc',
  templates: 'templates',
  lme: 'lme',
  archive: 'archive',
}

export interface WorkspaceHeaderProps {
  evolution: Evolution
  note: Note | null
  saveError: boolean
  savedAt: string | null
  openfinish: () => void
  openPc: () => void
  openDelete: () => void
  openArchive: () => void
}

export function Workspace(props: {
  id: string
  pcMode?: boolean
  header: (h: WorkspaceHeaderProps) => ReactNode
}) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const mobile = useIsMobile()
  const [evolution, setEvolution] = useState<Evolution | null>(null)
  const noteId = params.get('note')
  const [tool, setTool] = useState<ToolId | null>(PANEL_PARAM[params.get('panel') ?? ''] ?? null)
  const [railHover, setRailHover] = useState(false)
  const [dialog, setDialog] = useState<string | null>(params.get('dialog'))
  const [pc, setPc] = useState<'scan' | 'confirm' | null>(
    (params.get('pc') as 'scan' | 'confirm') ?? null,
  )
  const simulateError = params.has('simulateError')
  const [saveState, setSaveState] = useState<{ error: boolean; at: string | null }>({
    error: simulateError,
    at: null,
  })
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const editorRef = useRef<EditorApi>(null)
  const pendingSave = useRef<(() => void) | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // Os painéis montam junto com o editor, então leem a referência só na hora de usar.
  const editorApi = useMemo<EditorApi>(
    () => ({
      insert: (blocks) => editorRef.current?.insert(blocks),
      replaceAll: (blocks) => editorRef.current?.replaceAll(blocks),
      replaceBlock: (match, block) => editorRef.current?.replaceBlock(match, block) ?? false,
      document: () => editorRef.current?.document() ?? [],
    }),
    [],
  )

  const reload = useCallback(
    () =>
      Promise.all([api.getEvolution(props.id), api.listPatients()]).then(([e, list]) => {
        setEvolution(e)
        setPatients(list)
      }),
    [props.id],
  )
  useEffect(() => {
    void reload()
  }, [reload])

  const note = evolution ? (evolution.notes.find((n) => n.id === noteId) ?? evolution.notes[0] ?? null) : null
  const locked = Boolean(note?.locked_at)

  useEffect(() => {
    setSaveState({ error: simulateError, at: null })
  }, [note?.id, simulateError])

  const selectNote = (id: string) => {
    const next = new URLSearchParams(params)
    next.set('note', id)
    setParams(next, { replace: true })
    if (mobile) setTool(null)
  }

  const newNote = async () => {
    const created = await api.createNote(props.id)
    await reload()
    selectNote(created.id)
  }

  // Salva o que estiver pendente sem esperar o intervalo: ao trocar de paciente e antes de finalizar.
  const flushSave = useCallback(() => {
    clearTimeout(saveTimer.current)
    pendingSave.current?.()
    pendingSave.current = null
  }, [])
  useEffect(() => flushSave, [flushSave])

  const handleChange = (doc: NoteBlock[]) => {
    if (!note) return
    const noteId = note.id
    pendingSave.current = () => {
      pendingSave.current = null
      if (simulateError) {
        setSaveState({ error: true, at: null })
        return
      }
      void api.saveNote(props.id, noteId, doc).then((saved) => {
        setSaveState({ error: false, at: saved.updated_at })
        void reload()
      })
    }
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => pendingSave.current?.(), isCapture() ? 0 : 700)
  }

  const finish = async () => {
    if (!note) return
    flushSave()
    await api.finishNote(props.id, note.id)
    await reload()
    setDialog(null)
  }

  const removeNote = async () => {
    if (!note) return
    await api.deleteNote(props.id, note.id)
    const next = new URLSearchParams(params)
    next.delete('note')
    setParams(next, { replace: true })
    await reload()
    setDialog(null)
  }

  if (!evolution) {
    return (
      <div className={s.shell}>
        <div className={s.loading} />
      </div>
    )
  }

  const selectTool = (id: ToolId) => setTool((cur) => (cur === id ? null : id))
  const ActiveTool = tool ? TOOL_COMPONENTS[tool] : null
  const panelOpen = Boolean(tool)
  const railExpanded = panelOpen || railHover || params.get('rail') === 'open'
  const savedAt = saveState.at ?? note?.updated_at ?? null
  const today = groupByStatus(patients)
  const ordered = [...today.todo, ...today.finished]
  const position = ordered.findIndex((p) => p.id === props.id)
  const nextPatient = position >= 0 ? ordered[position + 1] : undefined
  const latest = evolution.notes[0]
  const noNoteToday =
    noteStatus({ last_note_at: latest?.updated_at ?? null, last_note_locked_at: latest?.locked_at ?? null }) ===
    'none'

  return (
    <div className={s.shell}>
      {props.header({
        evolution,
        note,
        saveError: saveState.error,
        savedAt,
        openfinish: () => setDialog('finish'),
        openPc: () => setPc('scan'),
        openDelete: () => setDialog('delete'),
        openArchive: () => setTool('archive'),
      })}
      <div className={`${s.body} ${props.pcMode ? s.pcBody : ''}`}>
        {!mobile && !props.pcMode && (
          <TodayPatients patients={ordered} currentId={props.id} doneCount={today.finished.length} />
        )}
        {mobile && (
          <ToolRail active={tool} expanded={false} onSelect={selectTool} onHover={() => undefined} />
        )}
        <main className={s.main}>
          {!note ? (
            <div className={s.center}>
              <Button className={s.first} onClick={() => void newNote()}>
                Criar primeira evolução
              </Button>
            </div>
          ) : (
            <div className={s.scroll}>
              {noNoteToday && (
                <div className={s.startBar}>
                  Sem evolução hoje. Esta é a nota de {formatDay(latest.created_at)}.
                  <Button onClick={() => void newNote()}>Iniciar evolução</Button>
                </div>
              )}
              {locked ? (
                <NoteReadOnly blocks={note.content} />
              ) : (
                <NoteEditor
                  key={note.id}
                  ref={editorRef}
                  content={note.content}
                  slash={params.get('slash')}
                  onChange={handleChange}
                  onOpenTool={setTool}
                />
              )}
              {nextPatient && !props.pcMode && (
                <Link className={s.nextPatient} to={`/evolucoes/${nextPatient.id}`}>
                  Próximo paciente: {displayName(nextPatient)}
                  <ArrowRight size={18} aria-hidden />
                </Link>
              )}
            </div>
          )}
        </main>
        {ActiveTool && tool && (
          <ToolPanel tool={tool} onClose={() => setTool(null)}>
            <ActiveTool
              evolution={evolution}
              note={note}
              editor={editorApi}
              params={params}
              onSelectNote={selectNote}
              onNewNote={() => void newNote()}
              onClose={() => setTool(null)}
            />
          </ToolPanel>
        )}
        {!mobile && (
          <ToolRail active={tool} expanded={railExpanded} onSelect={selectTool} onHover={setRailHover} />
        )}
      </div>

      <Dialog
        open={dialog === 'finish'}
        onClose={() => setDialog(null)}
        title="Finalizar evolução"
        icon={<CircleCheck className={dialogIconClass} size={26} strokeWidth={1.75} aria-hidden />}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={() => void finish()}>Finalizar evolução</Button>
          </>
        }
      >
        <p>
          Finalizar a evolução é o último passo do registro clínico – sinaliza que o conteúdo foi revisado e
          está pronto para ficar no prontuário.
        </p>
        <p>
          Depois de finalizada, <strong>nada mais pode ser alterado</strong> nesta evolução. Crie uma nova
          evolução para registrar mudanças posteriores.
        </p>
      </Dialog>

      <Dialog
        open={dialog === 'delete'}
        onClose={() => setDialog(null)}
        size="small"
        title="Excluir nota"
        icon={<Trash2 className={dialogIconClass} size={26} strokeWidth={1.75} aria-hidden />}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => void removeNote()}>
              Excluir
            </Button>
          </>
        }
      >
        <p>
          Tem certeza que deseja excluir{' '}
          <strong>"Evolução de {note && formatDateTime(note.created_at)}"</strong>?
        </p>
        <p style={{ marginTop: 7, color: 'var(--text-muted)', fontSize: 13.5 }}>
          Apenas esta nota sai da lista. As outras notas do paciente e o cadastro permanecem intactos. Por
          exigência de guarda de prontuário, a nota fica registrada como excluída, com a sua autoria e a data.
        </p>
      </Dialog>

      {pc && (
        <PcSheet
          initial={pc}
          patientName={displayName(evolution)}
          onClose={() => setPc(null)}
          onApprove={() => {
            setPc(null)
            navigate(`/bedside-pc/sessao?id=${evolution.id}`)
          }}
        />
      )}
    </div>
  )
}
