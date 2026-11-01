import { useState } from 'react'
import { ExternalLink, Plus, Search } from 'lucide-react'
import { APACS, LMES } from '@/mocks/lme'
import btn from '../ui/Button.module.css'
import s from './tools.module.css'

// Formulários fictícios: os links abrem uma aba em branco.
const FAKE_URL = 'about:blank'
// O escape aparece literalmente nas telas 46 e 47.
const PLACEHOLDER = 'Buscar formul\\u00e1rio...'

export function LmeApac() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const match = (i: { title: string; code: string }) => `${i.title} ${i.code}`.toLowerCase().includes(q)
  const groups = [
    { title: 'LMES', items: LMES.filter(match) },
    { title: 'APACS', items: APACS.filter(match) },
  ]
  return (
    <div className={s.fill}>
      <div className={s.lmeActions}>
        {['Nova LME', 'Nova APAC'].map((label) => (
          <a
            key={label}
            href={FAKE_URL}
            target="_blank"
            rel="noreferrer"
            className={`${btn.button} ${btn.secondary}`}
          >
            <Plus size={15} aria-hidden />
            {label}
          </a>
        ))}
      </div>
      <div className={s.search}>
        <Search size={15} strokeWidth={1.5} aria-hidden />
        <input
          aria-label="Buscar formulário"
          placeholder={PLACEHOLDER}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={s.scroll} style={{ marginTop: 7 }}>
        {groups.map((g) => (
          <div key={g.title} style={{ marginBottom: 9 }}>
            <span className={s.sectionLabel}>
              {g.title} · {g.items.length}
            </span>
            {g.items.map((i) => (
              <a key={i.id} href={FAKE_URL} target="_blank" rel="noreferrer" className={s.templateItem}>
                <div className={s.templateName}>
                  {i.title}
                  <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
                </div>
                <div className={s.templateText}>{i.code}</div>
                <div className={`${s.templateText} ${s.lmeMeta}`}>{i.meta}</div>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
