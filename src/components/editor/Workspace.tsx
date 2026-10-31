import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, CircleAlert, CircleCheck, Copy, Lock, Trash2 } from 'lucide-react'
import { ToolPanel } from '../layout/ToolPanel'
import { ToolRail } from '../layout/ToolRail'
import { TOOL_COMPONENTS } from '../tools'
import type { ToolId } from '../tools/registry'
import { Button } from '../ui/Button'
import { Dialog, dialogIconClass } from '../ui/Dialog'
import { isCapture } from '../../lib/capture'
import { formatDateTime, formatDayAtTime } from '../../lib/dates'
import { noteToText } from '../../lib/noteText'
import { displayName } from '../../lib/patient'
import { useIsMobile } from '../../lib/useIsMobile'
import { api } from '../../services/api'
import type { Evolution, Note, NoteBlock } from '../../types'
import { NoteEditor, type EditorApi } from './NoteEditor'
import { NoteReadOnly } from './NoteReadOnly'
import { PcSheet } from './PcSheet'
import s from './Workspace.module.css'

const PANEL_PARAM: Record<string, ToolId> = {
  historico: 'historico',
  companion: 'companion',
  passar: 'passar',
  fluxograma: 'fluxograma',
  cid: 'cid',
  calc: 'calc',
  templates: 'templates',
  lme: 'lme',
  arquivar: 'arquivar',
}

export interface WorkspaceHeaderProps {
  evolution: Evolution
  note: Note | null
  openFinalize: () => void
  openPc: () => void
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
  const noteId = params.get('nota')
  const [tool, setTool] = useState<ToolId | null>(PANEL_PARAM[params.get('painel') ?? ''] ?? null)
  const [railHover, setRailHover] = useState(false)
  const [dialog, setDialog] = useState<string | null>(params.get('dialogo'))
  const [pc, setPc] = useState<'escanear' | 'confirmar' | null>(
    (params.get('pc') as 'escanear' | 'confirmar') ?? null,
  )
  const simulateError = params.has('simularErro')
  const [saveState, setSaveState] = useState<{ error: boolean; at: string | null }>({
    error: simulateError,
    at: null,
  })
  const editorRef = useRef<EditorApi>(null)
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

  const reload = useCallback(() => api.getEvolution(props.id).then(setEvolution), [props.id])
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
    next.set('nota', id)
    setParams(next, { replace: true })
    if (mobile) setTool(null)
  }

  const newNote = async () => {
    const created = await api.createNote(props.id)
    await reload()
    selectNote(created.id)
  }

  const handleChange = (doc: NoteBlock[]) => {
    if (!note) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(
      () => {
        if (simulateError) {
          setSaveState({ error: true, at: null })
          return
        }
        void api.saveNote(props.id, note.id, doc).then((saved) => {
          setSaveState({ error: false, at: saved.updated_at })
          void reload()
        })
      },
      isCapture() ? 0 : 700,
    )
  }

  const copyAll = () => {
    if (!note) return
    const blocks = editorRef.current?.document() ?? note.content
    void navigator.clipboard.writeText(noteToText(blocks))
  }

  const finalize = async () => {
    if (!note) return
    await api.finalizeNote(props.id, note.id)
    await reload()
    setDialog(null)
  }

  const removeNote = async () => {
    if (!note) return
    await api.deleteNote(props.id, note.id)
    const next = new URLSearchParams(params)
    next.delete('nota')
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
  const railExpanded = panelOpen || railHover || params.get('rail') === 'aberta'
  const savedAt = saveState.at ?? note?.updated_at

  return (
    <div className={s.shell}>
      {props.header({
        evolution,
        note,
        openFinalize: () => setDialog('finalizar'),
        openPc: () => setPc('escanear'),
      })}
      <div className={`${s.body} ${props.pcMode ? s.pcBody : ''}`}>
        {mobile && (
          <ToolRail active={tool} expanded={false} onSelect={selectTool} onHover={() => undefined} />
        )}
        <main className={s.main}>
          {note && (
            <div className={s.bar}>
              {!locked && (
                <button
                  type="button"
                  className={`${s.iconBtn} ${s.delete}`}
                  aria-label="Excluir nota"
                  onClick={() => setDialog('excluir')}
                >
                  <Trash2 size={18} strokeWidth={1.5} aria-hidden />
                </button>
              )}
              <button type="button" className={s.iconBtn} aria-label="Copiar tudo" onClick={copyAll}>
                <Copy size={16} strokeWidth={1.75} aria-hidden />
              </button>
              {locked ? (
                <span className={s.status}>
                  <Lock size={13} strokeWidth={1.5} aria-hidden />
                  Finalizada em {formatDayAtTime(note.locked_at!)}
                </span>
              ) : saveState.error ? (
                <span className={`${s.status} ${s.statusError}`} role="status">
                  <CircleAlert size={16} strokeWidth={1.5} aria-hidden />
                  Erro ao salvar
                </span>
              ) : (
                <span className={s.status} role="status">
                  <Check size={13} strokeWidth={1.5} aria-hidden />
                  Salvo em {savedAt && formatDayAtTime(savedAt)}
                </span>
              )}
            </div>
          )}
          {!note ? (
            <div className={s.center}>
              <Button className={s.first} onClick={() => void newNote()}>
                Criar primeira evolução
              </Button>
            </div>
          ) : (
            <div className={s.scroll}>
              {locked ? (
                <NoteReadOnly blocks={note.content} />
              ) : (
                <NoteEditor
                  key={note.id}
                  ref={editorRef}
                  content={note.content}
                  barra={params.get('barra')}
                  onChange={handleChange}
                  onOpenTool={setTool}
                />
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
        open={dialog === 'finalizar'}
        onClose={() => setDialog(null)}
        title="Finalizar evolução"
        icon={<CircleCheck className={dialogIconClass} size={26} strokeWidth={1.75} aria-hidden />}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={() => void finalize()}>Finalizar evolução</Button>
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
        open={dialog === 'excluir'}
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
