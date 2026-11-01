import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { InsertToolFrame } from './InsertToolFrame'
import { noteToText } from '@/lib/noteText'
import { TEMPLATES } from '@/mocks/templates'
import type { NoteBlock } from '@/types'
import type { ToolProps } from './types'
import s from './tools.module.css'

// Nenhuma tela mostra templates do médico; o grupo só aparece quando houver algum.
const MINE: typeof TEMPLATES = []

export function Templates({ params, editor, note, cursorSection, onClose }: ToolProps) {
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState(TEMPLATES.find((t) => t.id === params.get('template')) ?? null)

  const filter = (list: typeof TEMPLATES) => {
    const q = query.trim().toLowerCase()
    return list.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(q))
  }
  const groups = useMemo(
    () => [
      { title: 'SISTEMA', items: filter(TEMPLATES) },
      { title: 'MEUS', items: filter(MINE) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

  const insert = () => {
    if (!pending) return
    editor?.insert(pending.blocks as NoteBlock[])
    setPending(null)
    onClose()
  }

  return (
    <InsertToolFrame
      editor={editor}
      note={note}
      cursorSection={cursorSection}
      preview={pending ? noteToText(pending.blocks as NoteBlock[]) : null}
      actionLabel="Inserir template no cursor"
      onInsert={insert}
      tags={pending ? [{ id: pending.id, label: pending.name, onRemove: () => setPending(null) }] : []}
    >
      <div className={s.search}>
        <Search size={15} strokeWidth={1.5} aria-hidden />
        <input
          aria-label="Buscar template"
          autoFocus
          placeholder="Buscar template..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={s.scroll} style={{ marginTop: 7 }}>
        {groups
          .filter((g) => g.items.length)
          .map((g) => (
            <div key={g.title}>
              <span className={s.sectionLabel}>
                {g.title} · {g.items.length}
              </span>
              {g.items.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${s.templateItem} ${pending?.id === t.id ? s.cidOn : ''}`}
                  aria-pressed={pending?.id === t.id}
                  onClick={() => setPending(t)}
                >
                  <div className={s.templateName}>{t.name}</div>
                  <div className={s.templateText}>{t.description}</div>
                </button>
              ))}
            </div>
          ))}
      </div>
    </InsertToolFrame>
  )
}
