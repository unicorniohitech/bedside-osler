import { TOOLS, type ToolId } from '../tools/registry'
import s from './ToolRail.module.css'

// Coluna de ícones para janelas abaixo de 1200 px, onde o painel inteiro não cabe.
export function ToolRail(props: { active: ToolId | null; onSelect: (id: ToolId) => void }) {
  return (
    <nav className={s.rail} aria-label="Ferramentas">
      {TOOLS.map(({ id, label, shortLabel, Icon }) => (
        <button
          key={id}
          type="button"
          className={`${s.item} ${props.active === id ? s.active : ''}`}
          aria-label={label}
          aria-pressed={props.active === id}
          title={label}
          onClick={() => props.onSelect(id)}
        >
          <Icon size={18} strokeWidth={1.5} aria-hidden />
          <span className={s.label}>{shortLabel}</span>
        </button>
      ))}
    </nav>
  )
}
