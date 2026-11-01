// Para cada imagem de telas/: abre a rota no viewport da imagem, tira o screenshot e gera
// compare/NN.png com original | protótipo | diferença. Uso: pnpm compare [01 02 13-19]
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { chromium, type Page } from 'playwright'
import { PNG } from 'pngjs'
import { SCENES } from './scenes'

const SCREENS = path.resolve('../teste-evolucoes-bedside/telas')
const OUT = path.resolve('compare')
const PORT = 5199
const BASE = `http://localhost:${PORT}`

function wanted(args: string[]) {
  if (!args.length) return () => true
  const set = new Set<number>()
  for (const a of args) {
    const [from, to] = a.split('-').map(Number)
    for (let n = from; n <= (to ?? from); n++) set.add(n)
  }
  return (n: number) => set.has(n)
}

function sideBySide(a: PNG, b: PNG) {
  const w = a.width
  const h = Math.max(a.height, b.height)
  const gap = 12
  const out = new PNG({ width: w * 3 + gap * 2, height: h })
  out.data.fill(255)
  PNG.bitblt(a, out, 0, 0, a.width, a.height, 0, 0)
  PNG.bitblt(b, out, 0, 0, b.width, Math.min(b.height, h), w + gap, 0)
  let differing = 0
  const diffX = (w + gap) * 2
  for (let y = 0; y < Math.min(a.height, b.height); y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const d = Math.max(
        Math.abs(a.data[i] - b.data[i]),
        Math.abs(a.data[i + 1] - b.data[i + 1]),
        Math.abs(a.data[i + 2] - b.data[i + 2]),
      )
      if (d > 32) differing++
      const o = (y * out.width + x + diffX) * 4
      const v = d > 32 ? 0 : 255 - d
      out.data[o] = d > 32 ? 220 : v
      out.data[o + 1] = v
      out.data[o + 2] = v
      out.data[o + 3] = 255
    }
  }
  return { out, pct: (differing / (a.width * a.height)) * 100 }
}

async function shoot(page: Page, url: string, name: string, act?: (p: Page) => Promise<void>) {
  await page.goto(BASE + url + (url.includes('?') ? '&' : '?') + 'captura=1')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  if (act) await act(page)
  await page.waitForTimeout(150)
  return page.screenshot({ path: path.join(OUT, 'raw', name) })
}

async function main() {
  fs.mkdirSync(path.join(OUT, 'raw'), { recursive: true })
  const server = spawn('pnpm', ['vite', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
    detached: true,
  })
  for (let i = 0; i < 80; i++) {
    try {
      await fetch(BASE)
      break
    } catch {
      await new Promise((r) => setTimeout(r, 250))
    }
  }
  const browser = await chromium.launch({ channel: 'chrome' })
  const results: string[] = []
  try {
    const isWanted = wanted(process.argv.slice(2))
    for (const scene of SCENES.filter((s) => isWanted(s.n))) {
      const file = fs.readdirSync(SCREENS).find((f) => f.startsWith(String(scene.n).padStart(2, '0') + '-'))!
      const original = PNG.sync.read(fs.readFileSync(path.join(SCREENS, file)))
      const ctx = await browser.newContext({
        viewport: { width: original.width, height: original.height },
        deviceScaleFactor: 1,
        permissions: ['clipboard-read', 'clipboard-write'],
      })
      const page = await ctx.newPage()
      page.on('pageerror', (e) => console.error(`[${file}] pageerror:`, e.message))
      const buf = await shoot(page, scene.url, file, scene.act)
      await ctx.close()
      const { out, pct } = sideBySide(original, PNG.sync.read(buf))
      fs.writeFileSync(path.join(OUT, file), PNG.sync.write(out))
      results.push(`${file.padEnd(34)} ${pct.toFixed(2).padStart(6)}%`)
    }
  } finally {
    await browser.close()
    process.kill(-server.pid!)
  }
  if (results.length === SCENES.length)
    fs.writeFileSync(path.join(OUT, 'result.txt'), results.join('\n') + '\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
