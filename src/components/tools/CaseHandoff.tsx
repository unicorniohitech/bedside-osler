import { useState } from 'react'
import { ClipboardList, Copy, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'
import { formatDateTime } from '@/lib/dates'
import { HANDOFF } from '@/mocks/ai'
import { isCapture } from '@/lib/capture'
import type { ToolProps } from './types'
import s from './tools.module.css'

const DISCLAIMER = 'Gerado por IA a partir das suas notas. Revise antes de usar.'

export function CaseHandoff({ params }: ToolProps) {
  const [generated, setGenerated] = useState(params.has('generated'))
  const [busy, setBusy] = useState(false)

  const generate = () => {
    setBusy(true)
    setTimeout(
      () => {
        setGenerated(true)
        setBusy(false)
      },
      isCapture() ? 0 : 600,
    )
  }

  const copy = () => {
    const text = [HANDOFF.meta, ...HANDOFF.sections.flatMap((x) => ['', x.title, x.text])].join('\n')
    void navigator.clipboard.writeText(text)
  }

  if (!generated) {
    return (
      <div className={s.fill}>
        <div className={s.empty}>
          <ClipboardList size={28} strokeWidth={1.25} aria-hidden />
          <div className={s.emptyTitle}>Passagem de caso</div>
          <p className={s.emptyText}>
            Apresentação do caso desde a admissão até hoje, escrita a partir das suas notas.
          </p>
        </div>
        <div className={s.foot}>
          <Button className={s.wide} disabled={busy} onClick={generate}>
            <ClipboardList size={15} aria-hidden />
            Gerar passagem de caso
          </Button>
          <p className={s.disclaimer} style={{ margin: '7px 0 17px' }}>
            {DISCLAIMER}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${s.fill} ${s.handoffFill}`}>
      <div className={s.scroll}>
        <div className={s.meta}>{HANDOFF.meta}</div>
        {HANDOFF.sections.map((x) => (
          <div key={x.title}>
            <div className={s.handoffTitle}>{x.title}</div>
            <p className={s.handoffText}>{x.text}</p>
          </div>
        ))}
        <div style={{ height: 13 }} />
      </div>
      <div className={s.foot}>
        <div className={s.when}>{formatDateTime(HANDOFF.generatedAt)}</div>
        <div className={s.stack}>
          <Button variant="secondary" className={s.wide} onClick={copy}>
            <Copy size={15} aria-hidden />
            Copiar
          </Button>
          <Button className={s.wide} disabled={busy} onClick={generate}>
            <RefreshCw size={15} aria-hidden />
            Gerar de novo
          </Button>
        </div>
        <p className={s.disclaimer} style={{ margin: '7px 0 5px' }}>
          {DISCLAIMER}
        </p>
      </div>
    </div>
  )
}
