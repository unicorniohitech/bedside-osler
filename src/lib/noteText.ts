import type { InlineText, NoteBlock } from '../types'

export const inlineText = (b: NoteBlock) =>
  Array.isArray(b.content) ? (b.content as InlineText[]).map((c) => c.text ?? '').join('') : ''

interface TableContent {
  rows: { cells: unknown[] }[]
}

const cellText = (cell: unknown): string => {
  if (typeof cell === 'string') return cell
  const c = cell as { content?: InlineText[] } | InlineText[]
  const parts = Array.isArray(c) ? c : (c.content ?? [])
  return parts.map((p) => p.text ?? '').join('')
}

export const tableRows = (b: NoteBlock) =>
  ((b.content as TableContent | undefined)?.rows ?? []).map((r) => r.cells.map(cellText))

export const VITAL_FIELDS = [
  { key: 'pa', label: 'PA (mmHg)' },
  { key: 'fc', label: 'FC (bpm)' },
  { key: 'fr', label: 'FR (irpm)' },
  { key: 'sat_o2', label: 'SatO2 (%)' },
  { key: 'temperatura', label: 'Temp (°C)' },
  { key: 'dor', label: 'Dor (0-10)' },
] as const

export function firstLine(blocks: NoteBlock[]) {
  for (const b of blocks) {
    const text = inlineText(b).trim()
    if (text) return text
  }
  return ''
}

export const hasText = (blocks: NoteBlock[]) =>
  blocks.some((b) => b.type !== 'paragraph' || inlineText(b).trim())

export function noteToText(blocks: NoteBlock[]) {
  const lines: string[] = []
  for (const b of blocks) {
    const p = (b.props ?? {}) as Record<string, string>
    switch (b.type) {
      case 'sectionHeader':
        if (lines.length) lines.push('')
        lines.push(p.title)
        break
      case 'bulletListItem':
        lines.push(`- ${inlineText(b)}`)
        break
      case 'numberedListItem':
        lines.push(`1. ${inlineText(b)}`)
        break
      case 'vitals':
        lines.push(VITAL_FIELDS.map((f) => `${f.label}: ${p[f.key] ?? ''}`).join(' | '))
        break
      case 'dictation':
        lines.push(p.transcribed_text)
        break
      case 'calcResult':
        lines.push(p.label, p.captured_text)
        break
      case 'table':
        for (const row of tableRows(b)) lines.push(row.join(' | '))
        break
      default:
        lines.push(inlineText(b))
    }
  }
  return lines.join('\n')
}
