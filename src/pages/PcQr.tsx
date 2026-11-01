import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Monitor, Smartphone } from 'lucide-react'
import { Watermark } from '@/components/layout/Watermark'
import { isCapture } from '../lib/capture'
import s from './PcQr.module.css'

// Conteúdo lido do QR da tela 53.
const QR_VALUE = 'pcqr_7f3a91c2d4e5b6a7f8091a2b3c4d5e6f'

export function PcQr() {
  const navigate = useNavigate()
  return (
    <div className={s.page}>
      <div className={s.brand} role="img" aria-label="Osler" />
      <div className={s.side}>
        <Watermark gutter={false}>
          <div className={s.center}>
            <main className={s.card}>
              <h1 className={s.title}>
                <Monitor size={26} strokeWidth={1.75} aria-hidden />
                Conectar este computador
              </h1>
              <p className={s.text}>
                No celular, dentro da evolução, toque em “Abrir no computador” e escaneie o código abaixo.
              </p>
              <div className={s.qr}>
                <QRCodeSVG value={QR_VALUE} size={220} level="M" marginSize={0} />
              </div>
              <div className={s.waiting}>
                <Smartphone size={16} strokeWidth={1.5} aria-hidden />
                Aguardando o celular escanear...
              </div>
            </main>
          </div>
        </Watermark>
      </div>
      {!isCapture() && (
        <button type="button" className={s.simulate} onClick={() => navigate('/bedside-pc/sessao')}>
          Simular leitura
        </button>
      )}
    </div>
  )
}
