import { useEffect, useRef } from 'react'
import type { SuggestionMenuProps } from '@blocknote/react'
import type { SlashItem } from './slashItems'
import s from './SlashMenu.module.css'

// Grupo sem título: o trecho entre Listas e Tabela não aparece nas telas.
const UNTITLED = 'Outros'

export function SlashMenu(props: SuggestionMenuProps<SlashItem> & { scrollToEnd: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.scrollToEnd && ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [props.scrollToEnd, props.items.length])

  useEffect(() => {
    if (props.scrollToEnd && props.selectedIndex === 0) return
    // Rola só a lista: mexer na rolagem da evolução deslocaria a linha em que o menu está ancorado.
    const list = ref.current
    const item = list?.querySelector<HTMLElement>(`.${s.selected}`)
    if (!list || !item) return
    const top = item.offsetTop - list.offsetTop
    if (top < list.scrollTop) list.scrollTop = top
    else if (top + item.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = top + item.offsetHeight - list.clientHeight
  }, [props.selectedIndex, props.scrollToEnd])

  return (
    <div ref={ref} className={s.menu} role="listbox" aria-label="Blocos">
      {props.items.map((item, i) => {
        const newGroup = i === 0 || props.items[i - 1].group !== item.group
        return (
          <div key={item.title}>
            {newGroup && i > 0 && <div className={s.groupRule} />}
            {newGroup && item.group !== UNTITLED && <div className={s.group}>{item.group}</div>}
            <button
              type="button"
              role="option"
              aria-selected={i === props.selectedIndex}
              className={`${s.item} ${item.bedside ? s.bedside : ''} ${i === props.selectedIndex ? s.selected : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => props.onItemClick?.(item)}
            >
              <span className={s.icon}>{item.icon}</span>
              <span className={s.title}>{item.title}</span>
              {item.shortcut && <span className={s.shortcut}>{item.shortcut}</span>}
            </button>
          </div>
        )
      })}
    </div>
  )
}
