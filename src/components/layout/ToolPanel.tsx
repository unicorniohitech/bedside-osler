import { ArrowLeft, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useIsMobile } from '@/lib/useIsMobile'
import { TOOLS, type ToolId } from '../tools/registry'
import { Sheet } from '../ui/Sheet'
import s from './ToolPanel.module.css'

export function ToolPanel(props: { tool: ToolId; onClose: () => void; children: ReactNode }) {
  const mobile = useIsMobile()
  const { label, group } = TOOLS.find((t) => t.id === props.tool)!

  if (mobile) {
    return (
      <Sheet title={label} size={group === 'insert' ? 'medium' : 'tall'} onClose={props.onClose}>
        {props.children}
      </Sheet>
    )
  }

  return (
    <aside className={s.panel} aria-label={label}>
      <div className={s.head}>
        <button type="button" className={s.back} onClick={props.onClose}>
          <ArrowLeft size={15} aria-hidden />
          Ferramentas
        </button>
        <button type="button" className={s.close} aria-label="Fechar" onClick={props.onClose}>
          <X size={18} aria-hidden />
        </button>
      </div>
      <h2 className={s.title}>{label}</h2>
      <div className={s.body}>{props.children}</div>
    </aside>
  )
}
