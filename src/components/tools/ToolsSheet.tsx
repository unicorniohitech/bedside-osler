import { COMPANION } from '@/mocks/ai'
import { Sheet } from '../ui/Sheet'
import { toolsOf, type ToolId } from './registry'
import s from './ToolsSheet.module.css'

export function ToolsSheet(props: { onOpenTool: (id: ToolId) => void; onClose: () => void }) {
  const block = (tool: ReturnType<typeof toolsOf>[number]) => (
    <button key={tool.id} type="button" className={s.block} onClick={() => props.onOpenTool(tool.id)}>
      <tool.Icon size={22} strokeWidth={1.75} aria-hidden />
      {tool.label}
      {tool.id === 'companion' && <span className={s.badge}>{COMPANION.alerts.length} alertas</span>}
    </button>
  )
  return (
    <Sheet title="Ferramentas" size="auto" onClose={props.onClose}>
      <h3 className={s.group}>Consultar o caso</h3>
      <div className={s.grid}>{toolsOf('consult').map(block)}</div>
      <h3 className={s.group}>Inserir na nota</h3>
      <div className={s.grid}>{toolsOf('insert').map(block)}</div>
      <hr className={s.separator} />
      <div className={s.grid}>{toolsOf('other').map(block)}</div>
    </Sheet>
  )
}
