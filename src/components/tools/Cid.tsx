import { useMemo, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { InsertToolFrame } from './InsertToolFrame'
import { noteToText } from '@/lib/noteText'
import { CID10 } from '@/mocks/cid'
import type { ToolProps } from './types'
import s from './tools.module.css'

const label = (c: (typeof CID10)[number]) => `${c.code} - ${c.name}`

export function Cid({ params, editor, note, evolution, cursorSection, onClose }: ToolProps) {
  const [query, setQuery] = useState(params.get('search') ?? '')
  const [selected, setSelected] = useState<string[]>(params.get('selected')?.split(',') ?? [])

  // Códigos que já aparecem em alguma nota deste paciente vêm primeiro.
  const used = useMemo(() => {
    const text = evolution.notes.map((n) => noteToText(n.content)).join('\n')
    return CID10.filter((c) => new RegExp(`(^|[^\\w.])${c.code.replace('.', '\\.')}($|[^\\w.])`).test(text))
  }, [evolution.notes])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return used
    const found = CID10.filter((c) => `${c.code} ${c.name} ${c.termos}`.toLowerCase().includes(q))
    return [...found.filter((c) => used.includes(c)), ...found.filter((c) => !used.includes(c))]
  }, [query, used])

  const toggle = (code: string) =>
    setSelected((c) => (c.includes(code) ? c.filter((x) => x !== code) : [...c, code]))

  const chosen = CID10.filter((c) => selected.includes(c.code))

  const insert = () => {
    editor?.insert(
      chosen.map((c) => ({
        type: 'paragraph',
        content: [{ type: 'text' as const, text: label(c), styles: {} }],
      })),
    )
    setSelected([])
    onClose()
  }

  return (
    <InsertToolFrame
      editor={editor}
      note={note}
      cursorSection={cursorSection}
      preview={chosen.length ? chosen.map(label).join('\n') : null}
      actionLabel={`Inserir ${chosen.length} ${chosen.length === 1 ? 'CID' : 'CIDs'} no cursor`}
      onInsert={insert}
      tags={chosen.map((c) => ({ id: c.code, label: c.code, onRemove: () => toggle(c.code) }))}
    >
      <div className={s.search}>
        <Search size={15} strokeWidth={1.5} aria-hidden style={{ top: 10 }} />
        <input
          aria-label="Buscar CID-10"
          autoFocus
          placeholder="Buscar CID-10..."
          style={{ height: 35 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className={s.searchClear}
            style={{ top: 11 }}
            aria-label="Limpar busca"
            onClick={() => setQuery('')}
          >
            <X size={11} aria-hidden />
          </button>
        )}
      </div>
      {(query.trim() || results.length > 0) && (
        <span className={s.sectionLabel} style={{ marginTop: 7, paddingLeft: 2 }}>
          {query.trim() ? 'RESULTADOS' : 'JÁ USADOS NESTE PACIENTE'} · {results.length}
        </span>
      )}
      <div className={s.scroll}>
        {results.map((c) => {
          const on = selected.includes(c.code)
          return (
            <label key={c.code} className={`${s.cidItem} ${on ? s.cidOn : ''}`}>
              <input type="checkbox" hidden checked={on} onChange={() => toggle(c.code)} />
              <span className={s.itemMain}>
                <span className={s.itemDate} style={{ display: 'block' }}>
                  {c.code}
                  {used.includes(c) && ' · já usado'}
                </span>
                <span className={s.itemTitle} style={{ display: 'block' }}>
                  {c.name}
                </span>
              </span>
              <span className={s.check} aria-hidden>
                {on && <Check size={14} strokeWidth={3} />}
              </span>
            </label>
          )
        })}
      </div>
    </InsertToolFrame>
  )
}
