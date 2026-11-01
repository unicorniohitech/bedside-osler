import { CircleUserRound } from 'lucide-react'
import { HEALTH_STATUS_LABEL } from '@/lib/patient'
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
  function getPatientImage(imageName: string) {
    if (imageName.startsWith('data:')) return imageName
    return new URL(`../../assets/patients/${imageName}.png`, import.meta.url).href
  }

  const color = status && HEALTH_STATUS_COLOR[status]
  const statusLabel = status && HEALTH_STATUS_LABEL[status]
  return (
    <span
      className={`${s.avatar} ${className ?? ''}`}
      style={{ width: size, height: size, color }}
      title={statusLabel}
      role={statusLabel ? 'img' : undefined}
      aria-label={statusLabel && `Estado de saúde: ${statusLabel}`}
    >
      {src ? (
        <img className={s.image} src={getPatientImage(src)} alt={alt} />
      ) : (
        <CircleUserRound size={size} strokeWidth={size < 60 ? 1.5 : 0.5} aria-hidden />
      )}
    </span>
  )
}
