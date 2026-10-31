import { Users } from 'lucide-react'
import { BackButton } from '../ui/BackButton'
import s from './AppHeader.module.css'

export function AppHeader({ title, back, icon = true }: { title: string; back: string; icon?: boolean }) {
  return (
    <header className={s.header}>
      <BackButton to={back} />
      {icon && <Users className={s.icon} size={26} strokeWidth={1.75} aria-hidden />}
      <h1 className={`${s.title} ${icon ? '' : s.titleNoIcon}`}>{title}</h1>
    </header>
  )
}
