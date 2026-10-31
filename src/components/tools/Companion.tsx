import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Bell, FileText, Info, ListChecks, RefreshCw, Sparkles, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { formatDateTime } from '../../lib/dates'
import { COMPANION, SUMMARIES } from '../../mocks/ai'
import { isCapture } from '../../lib/capture'
import type { ToolProps } from './types'
import s from './tools.module.css'

const DOT = { high: '#e53935', medium: '#eab308', low: '#9aa0a8' }
const DISCLAIMER = 'Sugestões do Osler Companion. Não substituem julgamento clínico.'

export function Companion({ params, evolution }: ToolProps) {
  const [analyzed, setAnalyzed] = useState(params.has('analisado'))
  const [busy, setBusy] = useState(false)

  const analyze = () => {
    setBusy(true)
    setTimeout(
      () => {
        setAnalyzed(true)
        setBusy(false)
      },
      isCapture() ? 0 : 600,
    )
  }

  if (!analyzed) {
    return (
      <div className={s.fill}>
        <div className={s.empty}>
          <Sparkles size={28} strokeWidth={1.25} aria-hidden />
          <div className={s.emptyTitle}>Osler Companion</div>
          <p className={s.emptyText}>
            Clique em Analisar para revisar a evolução do paciente com o Osler Companion.
          </p>
        </div>
        <div className={s.foot}>
          <Button className={s.wide} disabled={busy} onClick={analyze}>
            <Sparkles size={15} aria-hidden />
            Analisar paciente
          </Button>
          <p className={s.disclaimer}>{DISCLAIMER}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={s.fill}>
      <Tabs.Root defaultValue={params.get('aba') ?? 'alertas'} className={s.fill} style={{ marginTop: 3 }}>
        <Tabs.List className={s.tabs} aria-label="Análise">
          <Tabs.Trigger className={s.tab} value="alertas">
            <Bell size={13} strokeWidth={1.5} aria-hidden />
            Alertas · {COMPANION.alerts.length}
          </Tabs.Trigger>
          <Tabs.Trigger className={s.tab} value="pontos">
            <ListChecks size={13} strokeWidth={1.5} aria-hidden />
            Pontos · {COMPANION.points.length}
          </Tabs.Trigger>
          <Tabs.Trigger className={s.tab} value="resumo">
            <FileText size={13} strokeWidth={1.5} aria-hidden />
            Resumo
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={s.tabPanel} value="alertas">
          {COMPANION.alerts.map((a) => (
            <div key={a.title} className={`${s.alert} ${a.level === 'warning' ? s.alertWarn : ''}`}>
              {a.level === 'warning' ? (
                <TriangleAlert size={18} strokeWidth={1.5} aria-hidden />
              ) : (
                <Info size={18} strokeWidth={1.5} aria-hidden />
              )}
              <div>
                <div className={s.alertTitle}>{a.title}</div>
                <div className={s.alertText}>{a.text}</div>
              </div>
            </div>
          ))}
        </Tabs.Content>
        <Tabs.Content className={s.tabPanel} value="pontos">
          {COMPANION.points.map((p) => (
            <div
              key={p.title}
              className={s.point}
              style={{ '--dot': DOT[p.priority] } as React.CSSProperties}
            >
              <div className={s.pointTitle}>{p.title}</div>
              <div className={s.pointText}>{p.text}</div>
            </div>
          ))}
        </Tabs.Content>
        <Tabs.Content className={s.tabPanel} value="resumo">
          <p className={s.handoffText}>{SUMMARIES[evolution.id] ?? SUMMARIES.maria}</p>
        </Tabs.Content>
      </Tabs.Root>
      <div className={s.foot}>
        <div className={s.status}>
          <b>Atualizada</b>· {formatDateTime(COMPANION.analyzedAt)}
        </div>
        <Button className={s.wide} disabled={busy} onClick={analyze}>
          <RefreshCw size={15} aria-hidden />
          Regenerar análise
        </Button>
        <p className={s.disclaimer}>{DISCLAIMER}</p>
      </div>
    </div>
  )
}
