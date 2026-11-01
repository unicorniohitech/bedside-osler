import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { focusContent } from './Dialog'
import s from './Sheet.module.css'

export function Sheet(props: {
  title: string
  size: 'auto' | 'medium' | 'tall'
  onClose: () => void
  children: ReactNode
}) {
  return (
    <RadixDialog.Root open onOpenChange={(o) => !o && props.onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={s.overlay} />
        <RadixDialog.Content
          className={`${s.sheet} ${s[props.size]}`}
          aria-describedby={undefined}
          onOpenAutoFocus={focusContent}
        >
          <div className={s.head}>
            <RadixDialog.Title className={s.title}>{props.title}</RadixDialog.Title>
            <RadixDialog.Close className={s.close} aria-label="Fechar">
              <X size={20} aria-hidden />
            </RadixDialog.Close>
          </div>
          <div className={s.body}>{props.children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
