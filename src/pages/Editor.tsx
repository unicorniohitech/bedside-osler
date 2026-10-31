import { useParams } from 'react-router-dom'
import { CircleCheck, Monitor } from 'lucide-react'
import { Workspace, type WorkspaceHeaderProps } from '../components/editor/Workspace'
import { Badge } from '../components/ui/Badge'
import { BackButton } from '../components/ui/BackButton'
import { Button } from '../components/ui/Button'
import { displayName, headerLine } from '../lib/patient'
import s from './Editor.module.css'

function EditorHeader({ evolution, note, openFinalize, openPc }: WorkspaceHeaderProps) {
  const locked = Boolean(note?.locked_at)
  return (
    <header className={s.header}>
      <BackButton to="/evolucoes" />
      <div className={s.titleBlock}>
        <h1 className={s.name}>{displayName(evolution)}</h1>
        <div className={s.meta}>{headerLine(evolution)}</div>
      </div>
      <div className={s.actions}>
        {locked && (
          <Badge tone="finalized">
            <CircleCheck size={13} strokeWidth={1.75} aria-hidden />
            Finalizada
          </Badge>
        )}
        <Button variant="secondary" onClick={openPc}>
          <Monitor size={15} strokeWidth={1.75} aria-hidden />
          Abrir no computador
        </Button>
        {note && !locked && (
          <Button onClick={openFinalize}>
            <CircleCheck size={15} strokeWidth={1.75} aria-hidden />
            Finalizar evolução
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
