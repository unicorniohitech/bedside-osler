import { CircleUserRound } from 'lucide-react'
import { HEALTH_STATUS_COLOR, type HealthStatus } from '../../types'
import s from './Avatar.module.css'

type Props = {
  src?: string
  alt?: string
  status?: HealthStatus
  size?: number
  className?: string
}

export function Avatar({ src, alt = '', status, size = 100, className }: Props) {
  // console.log("🚀 ~ Avatar ~ src:", src)
  function getPatientImage(imageName: string | undefined) {
  console.log("🚀 ~ getPatientImage ~ imageName:", imageName)
  // O Vite analisa essa linha e inclui a imagem no build final
  return new URL(`../../assets/patients/${imageName}.png`, import.meta.url).href;
}
  console.log(getPatientImage(src), "🚀 ~ Avatar ~ src:", src)

  const color = status && HEALTH_STATUS_COLOR[status]
  return (
    <span className={`${s.avatar} ${className ?? ''}`} style={{ width: size, height: size, color }}>
      {src ? (
        <img className={s.image} src={getPatientImage(src)} alt={alt} />
      ) : (
        // O círculo do próprio ícone faz o papel de borda.
        <CircleUserRound size={size} strokeWidth={0.5} aria-hidden />
      )}
    </span>
  )
}
