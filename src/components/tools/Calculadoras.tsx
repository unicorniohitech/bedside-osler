import { useMemo, useState } from 'react'
import { ArrowLeft, Eraser, FilePlus2, Info, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { CALCULATOR_GROUPS, CURB65 } from '../../mocks/calculators'
import type { ToolProps } from './types'
import s from './tools.module.css'

function Curb65({
  editor,
  onBack,
  onClose,
}: {
  editor: ToolProps['editor']
  onBack: () => void
  onClose: () => void
}) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const score = Object.values(answers).filter(Boolean).length

  const insert = () => {
    editor?.insert([
      {
        type: 'calcResult',
        props: { calc_id: CURB65.id, label: CURB65.label, captured_text: `Pontuação: ${score}` },
      },
    ])
    onClose()
  }

  return (
    <div className={s.fill}>
      <div className={s.calcHead}>
        <button type="button" className={s.textBtn} onClick={onBack}>
          <ArrowLeft size={15} aria-hidden />
          Voltar
        </button>
        <b>{CURB65.label}</b>
      </div>
      <div className={s.calcScroll}>
        <div className={s.about}>
          <Info size={20} strokeWidth={1.5} aria-hidden />
          <div>
            <div className={s.aboutTitle}>{CURB65.aboutTitle}</div>
            {CURB65.about.map((t) => (
              <p key={t} className={s.aboutText}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <div className={s.criteriaCard}>
          {CURB65.criteria.map((c) => (
            <div key={c.id} className={s.criterion}>
              <div className={s.criterionTitle}>{c.title}</div>
              {[false, true].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  className={`${s.option} ${answers[c.id] === v ? s.optionOn : ''}`}
                  aria-pressed={answers[c.id] === v}
                  onClick={() => setAnswers((a) => ({ ...a, [c.id]: v }))}
                >
                  {v ? 'Sim' : 'Não'}
                  <small>{v ? '+1' : '0'}</small>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className={s.score}>
          {score} {score === 1 ? 'ponto' : 'pontos'}
          <button type="button" className={s.reset} aria-label="Limpar" onClick={() => setAnswers({})}>
            <Eraser size={16} aria-hidden />
          </button>
        </div>
      </div>
      <div className={s.endActions} style={{ paddingTop: 16 }}>
        <Button onClick={insert}>
          <FilePlus2 size={15} aria-hidden />
          Inserir resultado
        </Button>
      </div>
    </div>
  )
}

export function Calculadoras({ params, editor, onClose }: ToolProps) {
  const [open, setOpen] = useState(params.get('calc') === CURB65.id)
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CALCULATOR_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.name.toLowerCase().includes(q)),
    })).filter((g) => g.items.length)
  }, [query])

  if (open) return <Curb65 editor={editor} onBack={() => setOpen(false)} onClose={onClose} />

  return (
    <div className={s.fill}>
      <div className={s.search}>
        <Search size={15} strokeWidth={1.5} aria-hidden />
        <input
          aria-label="Buscar calculadora"
          placeholder="Buscar calculadora..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={s.scroll} style={{ marginTop: 7, marginBottom: 17 }}>
        {groups.map((g) => (
          <div key={g.title} style={{ marginBottom: 7 }}>
            <span className={s.sectionLabel}>
              {g.title} · {g.count}
            </span>
            {g.items.map((i) => (
              <button key={i.name} type="button" className={s.calcItem} onClick={() => i.id && setOpen(true)}>
                {i.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
