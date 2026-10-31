import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import s from './Dialog.module.css'

// Foco inicial na própria janela: o Tab segue pelos controles, sem anel de foco no ✕ ao abrir.
export const focusContent = (e: Event) => {
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).focus()
}

export function Dialog(props: {
  open: boolean
  onClose: () => void
  title: string
  icon: ReactNode
  size?: 'small'
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <RadixDialog.Root open={props.open} onOpenChange={(o) => !o && props.onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={s.overlay} />
        <RadixDialog.Content
          className={`${s.content} ${props.size === 'small' ? s.small : ''}`}
          aria-describedby={undefined}
          onOpenAutoFocus={focusContent}
        >
          <div className={s.head}>
            {props.icon}
            <RadixDialog.Title className={s.title}>{props.title}</RadixDialog.Title>
            <RadixDialog.Close className={s.close} aria-label="Fechar">
              <X size={18} aria-hidden />
            </RadixDialog.Close>
          </div>
          <div className={s.body}>{props.children}</div>
          <div className={s.foot}>{props.footer}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

export const dialogIconClass = s.icon
