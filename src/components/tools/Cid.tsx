import { useMemo, useState } from 'react'
import { Check, FilePlus2, Search, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { CID10 } from '../../mocks/cid'
import type { ToolProps } from './types'
import s from './tools.module.css'

export function Cid({ params, editor, onClose }: ToolProps) {
  const [query, setQuery] = useState(params.get('busca') ?? '')
  const [selected, setSelected] = useState<string[]>(params.get('sel')?.split(',') ?? [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CID10.filter((c) => `${c.code} ${c.name} ${c.termos}`.toLowerCase().includes(q))
  }, [query])

  const toggle = (code: string) =>
    setSelected((c) => (c.includes(code) ? c.filter((x) => x !== code) : [...c, code]))

  const insert = () => {
    const blocks = CID10.filter((c) => selected.includes(c.code)).map((c) => ({
      type: 'paragraph',
      content: [{ type: 'text' as const, text: `${c.code} - ${c.name}`, styles: {} }],
    }))
    editor?.insert(blocks)
    setSelected([])
    onClose()
  }

  return (
    <div className={s.fill}>
      <div className={s.search}>
        <Search size={15} strokeWidth={1.5} aria-hidden style={{ top: 10 }} />
        <input
          aria-label="Buscar CID-10"
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
      {query.trim() && (
        <span className={s.sectionLabel} style={{ marginTop: 7, paddingLeft: 2 }}>
          RESULTADOS · {results.length}
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
      {selected.length > 0 && (
        <div className={s.endActions}>
          <Button variant="secondary" onClick={() => setSelected([])}>
            Limpar
          </Button>
          <Button onClick={insert}>
            <FilePlus2 size={15} aria-hidden />
            Inserir {selected.length} {selected.length === 1 ? 'CID' : 'CIDs'}
          </Button>
        </div>
      )}
    </div>
  )
}
