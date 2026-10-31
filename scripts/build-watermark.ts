// Monta o SVG repetido da marca d'água a partir da assinatura traçada em extract-assets.ts.
import fs from 'node:fs'
const d = fs.readFileSync('src/assets/osler-signature.path.txt', 'utf8')
const W = 160,
  H = 96,
  X0 = 6,
  Y0 = -4,
  DX = 78,
  DY = 48
const uses: string[] = []
for (let row = -1; row <= 2; row++) {
  for (let col = -2; col <= 1; col++) {
    const x = X0 + col * W + (((row % 2) + 2) % 2 ? DX : 0)
    uses.push(`<use href="#s" x="${x}" y="${Y0 + row * DY}"/>`)
  }
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><path id="s" d="${d}" fill-rule="evenodd"/></defs><g fill="#F3F3F3">${uses.join('')}</g></svg>`
fs.writeFileSync('src/assets/watermark.svg', svg)
