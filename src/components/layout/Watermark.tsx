import type { ReactNode } from 'react'
import s from './Watermark.module.css'

export function Watermark({
  children,
  gutter = true,
  className,
}: {
  children?: ReactNode
  gutter?: boolean
  className?: string
}) {
  return (
    <div className={`${s.root} ${gutter ? s.gutter : ''} ${className ?? ''}`}>
      <div className={s.pattern} aria-hidden />
      <div className={s.content}>{children}</div>
    </div>
  )
}
