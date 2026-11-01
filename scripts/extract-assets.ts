// Gera os assets derivados das telas: painel vermelho (53), marca d'água em SVG e o conteúdo do QR.
import fs from 'node:fs'
import { PNG } from 'pngjs'
import potrace from 'potrace'
import jsQR from 'jsqr'

const SCREENS = '../teste-evolucoes-bedside/telas/'
const src = PNG.sync.read(fs.readFileSync(SCREENS + '53-PC-QR.png'))

function crop(x: number, y: number, w: number, h: number) {
  const out = new PNG({ width: w, height: h })
  PNG.bitblt(src, out, x, y, w, h, 0, 0)
  return out
}

fs.writeFileSync('src/assets/pc-panel.png', PNG.sync.write(crop(0, 0, 524, 900)))

// Assinatura branca sobre o vermelho vira preta sobre branco para o potrace.
const box = { x: 180, y: 508, w: 164, h: 58 }
const sig = crop(box.x, box.y, box.w, box.h)
for (let i = 0; i < sig.data.length; i += 4) {
  const v = 255 - sig.data[i + 1]
  sig.data[i] = sig.data[i + 1] = sig.data[i + 2] = v
}
const tmp = 'node_modules/.tmp-sig.png'
fs.writeFileSync(tmp, PNG.sync.write(sig))
potrace.trace(tmp, { threshold: 128, turdSize: 4 }, (err: Error | null, svg: string) => {
  if (err) throw err
  const d = /d="([^"]+)"/.exec(svg)![1]
  fs.writeFileSync('src/assets/osler-signature.path.txt', d)
})

const qr = jsQR(new Uint8ClampedArray(src.data), src.width, src.height)
