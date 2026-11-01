import { useMemo } from 'react'
import { Lock } from 'lucide-react'
import { formatDateTime } from '@/lib/dates'
import { extractLabs } from '@/lib/labs'
import { firstLine } from '@/lib/noteText'
import { COMPANION } from '@/mocks/ai'
import type { Evolution } from '@/types'
import { toolsOf, type ToolId } from './registry'
import s from './ToolsHome.module.css'

const VISIBLE_NOTES = 3

export function ToolsHome(props: {
  evolution: Evolution
  onSelectNote: (id: string) => void
  onOpenTool: (id: ToolId) => void
}) {
  const { notes } = props.evolution
  const labDates = useMemo(() => extractLabs(notes).dates.length, [notes])
  const hints: Partial<Record<ToolId, string>> = {
    companion: `${COMPANION.alerts.length} alertas`,
    flowchart: `${labDates} ${labDates === 1 ? 'data' : 'datas'}`,
  }
  const row = (tool: ReturnType<typeof toolsOf>[number]) => (
    <button key={tool.id} type="button" className={s.tool} onClick={() => props.onOpenTool(tool.id)}>
      <tool.Icon size={16} strokeWidth={1.75} aria-hidden />
      <span className={s.toolLabel}>{tool.label}</span>
      {tool.shortcut ? (
        <kbd className={s.hint}>{tool.shortcut}</kbd>
      ) : (
        hints[tool.id] && <span className={s.hint}>{hints[tool.id]}</span>
      )}
    </button>
  )
  const [lme, archive] = toolsOf('other')
  return (
    <div className={s.home}>
      <section className={s.card}>
        <div className={s.historyHead}>
          <h2 className={s.historyTitle}>Histórico · {notes.length} notas</h2>
          <button type="button" className={s.seeAll} onClick={() => props.onOpenTool('history')}>
            Ver todas
          </button>
        </div>
        {notes.slice(0, VISIBLE_NOTES).map((n) => (
          <button key={n.id} type="button" className={s.note} onClick={() => props.onSelectNote(n.id)}>
            <span className={s.noteDate}>
              {formatDateTime(n.created_at)}
              {n.locked_at && <Lock size={12} strokeWidth={2} aria-label="Finalizada" />}
            </span>
            <span className={s.noteLine}>{firstLine(n.content)}</span>
          </button>
        ))}
      </section>
      <section className={s.card}>
        <h3 className={s.groupTitle}>Consultar o caso</h3>
        {toolsOf('consult').map(row)}
        <h3 className={s.groupTitle}>Inserir na nota</h3>
        {toolsOf('insert').map(row)}
        <hr className={s.separator} />
        {row(lme)}
        <button type="button" className={s.archive} onClick={() => props.onOpenTool(archive.id)}>
          {archive.label}
        </button>
      </section>
    </div>
  )
}
