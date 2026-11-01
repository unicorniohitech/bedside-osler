import { useMemo, useState } from 'react'
import { Search, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { hasText } from '@/lib/noteText'
import { TEMPLATES } from '@/mocks/templates'
import type { NoteBlock } from '@/types'
import type { ToolProps } from './types'
import s from './tools.module.css'

// Nenhuma tela mostra templates do médico; o grupo só aparece quando houver algum.
const MINE: typeof TEMPLATES = []

export function Templates({ params, editor, onClose }: ToolProps) {
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

  const apply = (t: (typeof TEMPLATES)[number]) => {
    editor?.replaceAll(t.blocks as NoteBlock[])
    setPending(null)
    onClose()
  }

  const choose = (t: (typeof TEMPLATES)[number]) => {
    if (editor && hasText(editor.document())) setPending(t)
    else apply(t)
  }

  return (
    <div className={s.fill}>
      <div className={s.search}>
        <Search size={15} strokeWidth={1.5} aria-hidden />
        <input
          aria-label="Buscar template"
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
                <button key={t.id} type="button" className={s.templateItem} onClick={() => choose(t)}>
                  <div className={s.templateName}>{t.name}</div>
                  <div className={s.templateText}>{t.description}</div>
                </button>
              ))}
            </div>
          ))}
      </div>
      {pending && (
        <div className={s.confirm}>
          <div className={s.confirmHead}>
            <TriangleAlert size={16} strokeWidth={1.5} aria-hidden />
            <div>
              <div className={s.confirmTitle}>Substituir conteúdo da evolução?</div>
              <div className={s.confirmText}>
                A evolução atual já tem conteúdo. Aplicar "{pending.name}" vai sobrescrever tudo.
              </div>
            </div>
          </div>
          <div className={s.confirmActions}>
            <Button variant="secondary" onClick={() => setPending(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => apply(pending)}>
              Substituir
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
