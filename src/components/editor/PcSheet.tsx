import { useState } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { CircleCheck, Monitor, ShieldAlert, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { focusContent } from '../ui/Dialog'
import s from './PcSheet.module.css'

export function PcSheet(props: {
  initial: 'scan' | 'confirm'
  patientName: string
  onClose: () => void
  onApprove: () => void
}) {
  const [step, setStep] = useState(props.initial)
  return (
    <RadixDialog.Root open onOpenChange={(o) => !o && props.onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={s.overlay} />
        <RadixDialog.Content className={s.sheet} aria-describedby={undefined} onOpenAutoFocus={focusContent}>
          <div className={s.head}>
            <Monitor size={20} strokeWidth={1.75} aria-hidden />
            <RadixDialog.Title className={s.title}>Abrir no computador</RadixDialog.Title>
            <RadixDialog.Close className={s.close} aria-label="Fechar">
              <X size={18} aria-hidden />
            </RadixDialog.Close>
          </div>
          {step === 'scan' ? (
            <div className={s.body}>
              <p>
                No computador, abra <strong>oslermedicina.com.br/bedside-pc</strong> e aponte a câmera para o
                QR na tela.
              </p>
              <button
                type="button"
                className={s.camera}
                aria-label="Câmera: simular leitura do QR"
                onClick={() => setStep('confirm')}
              >
                <span className={s.frame} />
              </button>
            </div>
          ) : (
            <div className={`${s.body} ${s.confirmBody}`}>
              <p>
                Conectar o computador à evolução de <strong>{props.patientName}</strong>?
              </p>
              <div className={s.warn}>
                <ShieldAlert size={20} strokeWidth={1.5} aria-hidden />
                Só aprove se o QR está sendo exibido no computador da enfermaria à sua frente.
              </div>
              <div className={s.actions}>
                <Button variant="secondary" onClick={props.onClose}>
                  Cancelar
                </Button>
                <Button onClick={props.onApprove}>
                  <CircleCheck size={16} aria-hidden />
                  Aprovar
                </Button>
              </div>
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
