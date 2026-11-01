import { useEffect, type ReactNode } from 'react'
import { FilePlus2, X } from 'lucide-react'
import { Button } from '../ui/Button'
import type { ToolProps } from './types'
import s from './InsertToolFrame.module.css'

export function InsertToolFrame(props: {
  editor: ToolProps['editor']
  note: ToolProps['note']
  cursorSection: string | null
  // Texto da prévia tracejada na nota; o botão só aparece quando há algo a inserir.
  preview: string | null
  actionLabel: string
  onInsert: () => void
  tags?: { id: string; label: string; onRemove: () => void }[]
  children: ReactNode
}) {
  const { editor, preview } = props
  const locked = !props.note || Boolean(props.note.locked_at)

  useEffect(() => {
    if (locked) return
    editor?.setPreview(preview)
    return () => editor?.setPreview(null)
  }, [editor, preview, locked])

  return (
    <div className={s.frame}>
      <p className={s.where}>
        {locked
          ? 'Esta nota está finalizada e não recebe inserções.'
          : props.cursorSection
            ? `Insere em ${props.cursorSection}, onde o cursor está`
            : 'Insere onde o cursor está'}
      </p>
      {props.tags && props.tags.length > 0 && (
        <div className={s.tags}>
          {props.tags.map((t) => (
            <button key={t.id} type="button" className={s.tag} onClick={t.onRemove} aria-label={`Remover ${t.label}`}>
              {t.label}
              <X size={12} aria-hidden />
            </button>
          ))}
        </div>
      )}
      <div className={s.content}>{props.children}</div>
      {preview && !locked && (
        <div className={s.foot}>
          <Button className={s.insert} onClick={props.onInsert}>
            <FilePlus2 size={15} aria-hidden />
            {props.actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
