import type { Note } from '../types'
import { inlineText, tableRows } from './noteText'

export interface LabSheet {
  dates: string[]
  analytes: string[]
  values: Record<string, Record<string, string>>
}

const LAB_LINE = /^LAB \((\d{2}\/\d{2})\):\s*(.+)$/
const dateKey = (d: string) => d.split('/').reverse().join('')

export function extractLabs(notes: Note[]): LabSheet {
  const values: LabSheet['values'] = {}
  const analytes: string[] = []
  const chronological = [...notes].sort((a, b) => a.created_at.localeCompare(b.created_at))
  for (const note of chronological) {
    for (const block of note.content) {
      const match = LAB_LINE.exec(inlineText(block).trim())
      if (!match) continue
      const [, date, rest] = match
      for (const piece of rest.split('|')) {
        const m = /^\s*(\S+)\s+(.+?)\s*$/.exec(piece)
        if (!m) continue
        if (!analytes.includes(m[1])) analytes.push(m[1])
        ;(values[date] ??= {})[m[1]] = m[2]
      }
    }
  }
  return { dates: Object.keys(values).sort((a, b) => dateKey(a).localeCompare(dateKey(b))), analytes, values }
}

export function labTableBlock(sheet: LabSheet, dates: string[]) {
  const rows = [
    ['', ...dates],
    ...sheet.analytes.map((a) => [a, ...dates.map((d) => sheet.values[d]?.[a] ?? '')]),
  ]
  return {
    type: 'table',
    content: { type: 'tableContent', rows: rows.map((cells) => ({ cells })) },
  }
}

// A tabela do fluxograma é a que tem o canto vazio e datas no cabeçalho.
export const isLabTable = (block: { type: string; content?: unknown }) => {
  if (block.type !== 'table') return false
  const head = tableRows(block)[0] ?? []
  return head[0] === '' && head.slice(1).every((c) => /^\d{2}\/\d{2}$/.test(c)) && head.length > 1
}
