import { CircleCheck, CircleAlert, Copy, Monitor } from 'lucide-react'
import { Button } from '../ui/Button'
import { Dialog, dialogIconClass } from '../ui/Dialog'
import { Sheet } from '../ui/Sheet'
import { useIsMobile } from '@/lib/useIsMobile'
import s from './FinishFlow.module.css'

export function FinishFlow(props: {
  copied: boolean
  onCopy: () => void
  onOpenPc: () => void
  onFinish: () => void
  onClose: () => void
}) {
  const mobile = useIsMobile()
  const title = props.copied ? 'Texto copiado' : 'Não foi possível copiar'
  const buttons = (
    <>
      <Button variant="secondary" onClick={props.onClose}>
        Manter como rascunho
      </Button>
      <Button onClick={props.onFinish}>Finalizar evolução</Button>
    </>
  )
  const body = (
    <>
      {props.copied ? (
        <p>Cole o texto no prontuário do hospital. Ele foi copiado como texto puro, sem formatação.</p>
      ) : (
        <div className={s.retry}>
          <p>O navegador não liberou a área de transferência. Tente copiar de novo.</p>
          <Button variant="secondary" onClick={props.onCopy}>
            <Copy size={16} aria-hidden />
            Copiar de novo
          </Button>
        </div>
      )}
      <button type="button" className={s.alternative} onClick={props.onOpenPc}>
        <Monitor size={16} strokeWidth={1.75} aria-hidden />
        Prefiro abrir no computador do hospital
      </button>
      <div className={s.finish}>
        <strong>Já colou? Finalize para fechar a nota</strong>
        <p>Depois de finalizada, a nota fica só para leitura.</p>
      </div>
    </>
  )

  if (mobile) {
    return (
      <Sheet title={title} size="auto" onClose={props.onClose}>
        <div className={s.sheetBody}>{body}</div>
        <div className={s.sheetButtons}>{buttons}</div>
      </Sheet>
    )
  }

  const Icon = props.copied ? CircleCheck : CircleAlert
  return (
    <Dialog
      open
      onClose={props.onClose}
      size="small"
      title={title}
      icon={<Icon className={dialogIconClass} size={26} strokeWidth={1.75} aria-hidden />}
      footer={buttons}
    >
      {body}
    </Dialog>
  )
}
