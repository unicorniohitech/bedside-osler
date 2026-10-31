import * as Dropdown from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import s from './Menu.module.css'

export function Menu(props: {
  trigger: ReactNode
  open?: boolean
  onOpenChange?: (v: boolean) => void
  children: ReactNode
}) {
  return (
    <Dropdown.Root open={props.open} onOpenChange={props.onOpenChange} modal={false}>
      <Dropdown.Trigger asChild>{props.trigger}</Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className={s.content} align="end" sideOffset={4} collisionPadding={0}>
          {props.children}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}

export function MenuItem({ onSelect, children }: { onSelect: () => void; children: ReactNode }) {
  return (
    <Dropdown.Item className={s.item} onSelect={onSelect}>
      {children}
    </Dropdown.Item>
  )
}
