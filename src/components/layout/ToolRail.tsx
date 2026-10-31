import { TOOLS, type ToolId } from '../tools/registry'
import s from './ToolRail.module.css'

export function ToolRail(props: {
  active: ToolId | null
  expanded: boolean
  onSelect: (id: ToolId) => void
  onHover: (hovering: boolean) => void
}) {
  return (
    <nav
      className={`${s.rail} ${props.expanded ? s.expanded : ''}`}
      aria-label="Ferramentas"
      onMouseEnter={() => props.onHover(true)}
      onMouseLeave={() => props.onHover(false)}
    >
      {TOOLS.map(({ id, label, Icon }) => (
        <div key={id} style={{ display: 'contents' }}>
          {id === 'arquivar' && <div className={s.rule} />}
          <button
            type="button"
            className={`${s.item} ${props.active === id ? s.active : ''}`}
            aria-label={label}
            aria-pressed={props.active === id}
            title={label}
            onClick={() => props.onSelect(id)}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden />
            <span className={s.label}>{label}</span>
          </button>
        </div>
      ))}
    </nav>
  )
}
