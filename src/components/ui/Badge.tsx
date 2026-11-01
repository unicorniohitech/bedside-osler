import type { ReactNode } from 'react'
import s from './Badge.module.css'

export function Badge({ tone, children }: { tone: 'archived' | 'finishd'; children: ReactNode }) {
  return <span className={`${s.badge} ${s[tone]}`}>{children}</span>
}
