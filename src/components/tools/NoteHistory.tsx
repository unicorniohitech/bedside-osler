import { Lock, Plus } from 'lucide-react'
import { formatDateTime } from '@/lib/dates'
import { firstLine } from '@/lib/noteText'
import type { ToolProps } from './types'
import s from './tools.module.css'

export function NoteHistory({ evolution, note, onSelectNote, onNewNote }: ToolProps) {
  return (
    <div className={s.fill}>
      <div className={s.row}>
        <span className={s.sectionLabel}>EVOLUÇÕES · {evolution.notes.length}</span>
        <button type="button" className={s.textBtn} onClick={onNewNote}>
          <Plus size={15} aria-hidden />
          Nova
        </button>
      </div>
      <div className={s.scroll}>
        {evolution.notes.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`${s.item} ${n.id === note?.id ? s.itemCurrent : ''}`}
            onClick={() => onSelectNote(n.id)}
          >
            <span className={s.itemRow}>
              <span className={s.itemMain}>
                <span className={s.itemDate}>{formatDateTime(n.created_at)}</span>
                <span className={s.itemTitle} style={{ display: 'block' }}>
                  {firstLine(n.content)}
                </span>
              </span>
              {n.locked_at && (
                <Lock className={s.itemLock} size={13} strokeWidth={1.5} aria-label="Finalizada" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
