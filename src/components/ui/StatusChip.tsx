import type { ReactNode } from 'react'
import { Check, CircleAlert } from 'lucide-react'
import type { NoteStatus } from '@/lib/noteStatus'
import s from './StatusChip.module.css'

export function StatusDot({ status }: { status: NoteStatus }) {
  return <span className={`${s.dot} ${s[`dot_${status}`]}`} aria-hidden />
}

export function StatusChip({ tone, children }: { tone: NoteStatus | 'error'; children: ReactNode }) {
  return (
    <span className={`${s.chip} ${s[tone]}`} role={tone === 'error' ? 'alert' : undefined}>
      {tone === 'finished' && <Check size={14} strokeWidth={2.25} aria-hidden />}
      {tone === 'error' && <CircleAlert size={14} strokeWidth={2} aria-hidden />}
      {(tone === 'draft' || tone === 'none') && <StatusDot status={tone} />}
      {children}
    </span>
  )
}
