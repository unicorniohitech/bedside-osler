import { useParams } from 'react-router-dom'
import { Archive, Copy, Monitor, MoreVertical, Trash2 } from 'lucide-react'
import { Workspace, type WorkspaceHeaderProps } from '@/components/editor/Workspace'
import { Avatar } from '@/components/ui/Avatar'
import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/Button'
import { Menu, MenuItem } from '@/components/ui/Menu'
import { StatusChip } from '@/components/ui/StatusChip'
import { dayKey, formatDayAtTime, formatTime } from '@/lib/dates'
import { NOW_ISO } from '@/lib/clock'
import { bedLabel, CONTEXT_LABEL, displayName } from '../lib/patient'
import type { Evolution, Note } from '@/types'
import s from './Editor.module.css'

function HeaderChip(props: { note: Note | null; saveError: boolean; savedAt: string | null }) {
  const { note } = props
  if (!note) return <StatusChip tone="none">Primeira evolução</StatusChip>
  if (note.locked_at) {
    const today = dayKey(note.locked_at) === dayKey(NOW_ISO)
    return (
      <StatusChip tone="finished">
        Finalizada {today ? `às ${formatTime(note.locked_at)}` : `em ${formatDayAtTime(note.locked_at)}`}
      </StatusChip>
    )
  }
  if (props.saveError) return <StatusChip tone="error">Erro ao salvar</StatusChip>
  return <StatusChip tone="draft">Rascunho · salvo às {formatTime(props.savedAt ?? note.updated_at)}</StatusChip>
}

const metaLine = (e: Evolution) =>
  [
    bedLabel(e),
    CONTEXT_LABEL[e.context],
    [e.patient_age != null && `${e.patient_age} anos`, e.patient_sex].filter(Boolean).join(', '),
    e.patient_record && `Pront. ${e.patient_record}`,
  ]
    .filter(Boolean)
    .join(' · ')

function EditorHeader(props: WorkspaceHeaderProps) {
  const { evolution, note, openfinish, openPc, openDelete, openArchive } = props
  const locked = Boolean(note?.locked_at)
  return (
    <header className={s.header}>
      <BackButton to="/evolucoes" />
      <Avatar src={evolution.photo_avatar} status={evolution.health_status} size={44} />
      <div className={s.titleBlock}>
        <div className={s.titleRow}>
          <h1 className={s.name}>{displayName(evolution)}</h1>
          <HeaderChip note={note} saveError={props.saveError} savedAt={props.savedAt} />
        </div>
        <div className={s.meta}>{metaLine(evolution)}</div>
      </div>
      <div className={s.actions}>
        <Menu
          trigger={
            <Button variant="secondary" className={s.more} aria-label="Mais ações">
              <MoreVertical size={18} aria-hidden />
            </Button>
          }
        >
          {note && !locked && (
            <MenuItem onSelect={openDelete}>
              <Trash2 size={16} strokeWidth={1.5} aria-hidden />
              Excluir nota
            </MenuItem>
          )}
          <MenuItem onSelect={openArchive}>
            <Archive size={16} strokeWidth={1.5} aria-hidden />
            Arquivar
          </MenuItem>
        </Menu>
        <Button variant="secondary" onClick={openPc}>
          <Monitor size={16} strokeWidth={1.75} aria-hidden />
          Abrir no computador do hospital
        </Button>
        {note && !locked && (
          <Button onClick={openfinish}>
            <Copy size={16} strokeWidth={1.75} aria-hidden />
            Copiar e finalizar
          </Button>
        )}
      </div>
    </header>
  )
}

export function Editor() {
  const { id = '' } = useParams()
  return <Workspace key={id} id={id} header={(h) => <EditorHeader {...h} />} />
}
