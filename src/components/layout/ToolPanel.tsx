import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useIsMobile } from '@/lib/useIsMobile'
import { TOOLS, type ToolId } from '../tools/registry'
import { focusContent } from '../ui/Dialog'
import s from './ToolPanel.module.css'

export function ToolPanel(props: { tool: ToolId; onClose: () => void; children: ReactNode }) {
  const mobile = useIsMobile()
  const { label, Icon } = TOOLS.find((t) => t.id === props.tool)!

  if (mobile) {
    return (
      <RadixDialog.Root open onOpenChange={(o) => !o && props.onClose()}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className={s.overlay} />
          <RadixDialog.Content
            className={s.modal}
            aria-describedby={undefined}
            onOpenAutoFocus={focusContent}
          >
            <div className={s.modalHead}>
              <Icon size={24} strokeWidth={1.75} aria-hidden />
              <RadixDialog.Title className={s.modalTitle}>{label}</RadixDialog.Title>
              <RadixDialog.Close className={s.close} aria-label="Fechar">
                <X size={18} aria-hidden />
              </RadixDialog.Close>
            </div>
            <div className={s.body}>{props.children}</div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    )
  }

  return (
    <aside className={s.panel} aria-label={label}>
      <h2 className={s.title}>
        <Icon size={15} strokeWidth={1.75} aria-hidden />
        {label}
      </h2>
      <div className={s.body}>{props.children}</div>
    </aside>
  )
}
