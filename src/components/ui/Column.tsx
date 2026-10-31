import type { CSSProperties, HTMLAttributes } from 'react'
import s from './Column.module.css'

type Props = HTMLAttributes<HTMLDivElement> & {
  gap?: CSSProperties['gap']
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
}

export function Column({ gap, align, justify, className, style, ...rest }: Props) {
  return (
    <div
      className={`${s.column} ${className ?? ''}`}
      style={{ gap, alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    />
  )
}
