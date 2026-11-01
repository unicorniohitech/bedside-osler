import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CircleCheck, Clock, LogOut, Monitor } from 'lucide-react'
import { Workspace, type WorkspaceHeaderProps } from '@/components/editor/Workspace'
import { Button } from '@/components/ui/Button'
import { displayName } from '../lib/patient'
import s from './PcSession.module.css'

const SESSION_SECONDS = 2 * 60 * 60 - 60

function remaining(seconds: number) {
  const m = Math.floor(seconds / 60)
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m restantes`
}

function SessionBar({ evolution, openfinish }: WorkspaceHeaderProps) {
  const navigate = useNavigate()
  const [left, setLeft] = useState(SESSION_SECONDS)
  useEffect(() => {
    const timer = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <header className={s.top}>
      <Monitor size={16} strokeWidth={1.75} aria-hidden />
      Modo PC compartilhado
      <span className={s.dot}>•</span>
      {displayName(evolution)}
      <div className={s.right}>
        <span className={s.time} role="timer">
          <Clock size={13} strokeWidth={1.75} aria-hidden />
          {remaining(left)}
        </span>
        <button type="button" className={s.finish} onClick={openfinish}>
          <CircleCheck size={16} strokeWidth={1.75} aria-hidden />
          Finalizar evolução
        </button>
        <Button variant="secondary" className={s.end} onClick={() => navigate('/bedside-pc')}>
          <LogOut size={15} strokeWidth={1.75} aria-hidden />
          Encerrar sessão
        </Button>
      </div>
    </header>
  )
}

export function PcSession() {
  const [params] = useSearchParams()
  const id = params.get('id') ?? 'maria'
  return <Workspace key={id} id={id} pcMode header={(h) => <SessionBar {...h} />} />
}
