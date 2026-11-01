import { NOW_ISO } from './clock'
import { dayKey, formatDay, formatTime } from './dates'
import type { PatientListItem } from '../types'

export type NoteStatus = 'draft' | 'finished' | 'none'

type NoteDates = Pick<PatientListItem, 'last_note_at' | 'last_note_locked_at'>

// Regra única do status de hoje: lista, cabeçalho e coluna de pacientes leem daqui.
export function noteStatus(p: NoteDates): NoteStatus {
  if (!p.last_note_at || dayKey(p.last_note_at) !== dayKey(NOW_ISO)) return 'none'
  return p.last_note_locked_at ? 'finished' : 'draft'
}

export const STATUS_SHORT_LABEL: Record<NoteStatus, string> = {
  draft: 'rascunho',
  finished: 'finalizada',
  none: 'sem evolução',
}

export function statusLabel(p: NoteDates): string {
  const status = noteStatus(p)
  if (status === 'draft') return `Rascunho · salvo ${formatTime(p.last_note_at!)}`
  if (status === 'finished') return `Finalizada às ${formatTime(p.last_note_locked_at!)}`
  return p.last_note_at ? `Última em ${formatDay(p.last_note_at)}` : 'Primeira evolução'
}

// Pacientes não arquivados: rascunhos primeiro, depois sem evolução, e as finalizadas à parte.
export function groupByStatus<T extends PatientListItem>(patients: T[]) {
  const active = patients.filter((p) => !p.archived_at)
  const of = (status: NoteStatus) => active.filter((p) => noteStatus(p) === status)
  const finished = of('finished')
  return { todo: [...of('draft'), ...of('none')], finished, total: active.length }
}
