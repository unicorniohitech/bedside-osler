import type { CSSProperties, HTMLAttributes } from 'react'
import s from './Row.module.css'

type Props = HTMLAttributes<HTMLDivElement> & {
  gap?: CSSProperties['gap']
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
}

export function Row({ gap, align, justify, wrap, className, style, ...rest }: Props) {
  return (
    <div
      className={`${s.row} ${className ?? ''}`}
      style={{ gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined, ...style }}
      {...rest}
    />
  )
}
