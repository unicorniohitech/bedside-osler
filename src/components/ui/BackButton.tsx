import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import s from './BackButton.module.css'

export function BackButton({ to }: { to: string }) {
  return (
    <Link to={to} className={s.back} aria-label="Voltar">
      <ArrowLeft size={14} strokeWidth={2} aria-hidden />
    </Link>
  )
}
