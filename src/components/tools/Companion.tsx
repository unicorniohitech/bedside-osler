import { useEffect, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Bell, FileText, Info, ListChecks, RefreshCw, Sparkles, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { formatDateTime } from '@/lib/dates'
import { COMPANION, SUMMARIES } from '@/mocks/ai'
import { isCapture } from '@/lib/capture'
import { useIsMobile } from '@/lib/useIsMobile'
import {
  anchorExists,
  clearHighlights,
  highlightAnchors,
  scrollToAnchor,
  type NoteAnchor,
} from '@/lib/noteHighlight'
import type { ToolProps } from './types'
import s from './tools.module.css'

const DOT = { high: '#e53935', medium: '#eab308', low: '#9aa0a8' }
const DISCLAIMER = 'Sugestões do Osler Companion. Não substituem julgamento clínico.'

export function Companion({ params, evolution, note, onClose }: ToolProps) {
  const mobile = useIsMobile()
  const [analyzed, setAnalyzed] = useState(params.has('analyzed'))
  const [busy, setBusy] = useState(false)

  const [, setRendered] = useState(0)
  useEffect(() => {
    if (!analyzed) return
    // Os blocos especiais da nota, como os sinais vitais, renderizam um instante depois do painel.
    const timer = setTimeout(() => {
      highlightAnchors(COMPANION.alerts.map((a) => a.anchor))
      setRendered((n) => n + 1)
    }, 150)
    return () => {
      clearTimeout(timer)
      clearHighlights()
    }
  }, [analyzed, note?.id, note?.updated_at])

  // No celular a folha cobre a nota: fecha, rola até o trecho e mantém o destaque por alguns segundos.
  const showInNote = (anchor: NoteAnchor) => {
    if (!mobile) {
      scrollToAnchor(anchor)
      return
    }
    onClose()
    setTimeout(() => {
      highlightAnchors([anchor])
      scrollToAnchor(anchor)
      setTimeout(clearHighlights, 4000)
    }, 100)
  }

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
      <Tabs.Root defaultValue={params.get('tab') ?? 'alerts'} className={s.fill} style={{ marginTop: 3 }}>
        <Tabs.List className={s.tabs} aria-label="Análise">
          <Tabs.Trigger className={s.tab} value="alerts">
            <Bell size={13} strokeWidth={1.5} aria-hidden />
            Alertas · {COMPANION.alerts.length}
          </Tabs.Trigger>
          <Tabs.Trigger className={s.tab} value="points">
            <ListChecks size={13} strokeWidth={1.5} aria-hidden />
            Pontos · {COMPANION.points.length}
          </Tabs.Trigger>
          <Tabs.Trigger className={s.tab} value="summary">
            <FileText size={13} strokeWidth={1.5} aria-hidden />
            Resumo
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={s.tabPanel} value="alerts">
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
                {anchorExists(a.anchor) && (
                  <button type="button" className={s.textBtn} onClick={() => showInNote(a.anchor)}>
                    Ver na nota
                  </button>
                )}
              </div>
            </div>
          ))}
        </Tabs.Content>
        <Tabs.Content className={s.tabPanel} value="points">
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
        <Tabs.Content className={s.tabPanel} value="summary">
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
