import data from '../data/example-data.json'
import { NOW_ISO } from '../lib/clock'
import { isCapture } from '../lib/capture'
import { SUMMARIES } from '../mocks/ai'
import type { Evolution, NewPatientInput, Note, NoteBlock, PatientListItem } from '../types'

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T

const list = clone(data.list) as unknown as PatientListItem[]
const evolutions = clone(data.evolutions) as unknown as Record<string, Evolution>
let seq = 0

const wait = <T>(value: T): Promise<T> => {
  const ms = isCapture() ? 0 : 300 + Math.random() * 500
  return new Promise((resolve) => setTimeout(() => resolve(clone(value)), ms))
}

const syncListItem = (id: string) => {
  const item = list.find((p) => p.id === id)
  const evo = evolutions[id]
  if (!item || !evo) return
  const last = evo.notes[0]
  item.last_note_at = last?.updated_at ?? null
  item.last_note_locked_at = last?.locked_at ?? null
  item.archived_at = evo.archived_at
}

const requireNote = (id: string, noteId: string) => {
  const note = evolutions[id].notes.find((n) => n.id === noteId)
  if (!note) throw new Error('Nota não encontrada')
  return note
}

export const api = {
  listPatients: () => wait(list),

  // A foto e o health_status vêm da listagem, que é onde o JSON de exemplo os guarda.
  getEvolution(id: string) {
    const evolution = evolutions[id]
    const item = list.find((p) => p.id === id)
    if (!evolution) return wait(null)
    return wait({ ...evolution, photo_avatar: item?.photo_avatar, health_status: item?.health_status })
  },

  createPatient(input: NewPatientInput) {
    seq += 1
    const id = `new-${seq}`
    const base = { id, owner_id: 'u-medico', title: null, created_at: NOW_ISO, archived_at: null, ...input }
    list.unshift({ ...base, updated_at: NOW_ISO, last_note_at: null, last_note_locked_at: null })
    evolutions[id] = { ...base, notes: [] }
    return wait(id)
  },

  createNote(id: string, content: NoteBlock[] = [{ type: 'paragraph' }]) {
    seq += 1
    const note: Note = {
      id: `n-${id}-new-${seq}`,
      evolution_id: id,
      content,
      vitals: null,
      version: 1,
      created_at: NOW_ISO,
      updated_at: NOW_ISO,
      locked_at: null,
    }
    evolutions[id].notes.unshift(note)
    syncListItem(id)
    const item = list.find((p) => p.id === id)
    if (item) item.updated_at = NOW_ISO
    return wait(note)
  },

  saveNote(id: string, noteId: string, content: NoteBlock[]) {
    const note = requireNote(id, noteId)
    note.content = content
    note.updated_at = NOW_ISO
    note.version += 1
    syncListItem(id)
    const item = list.find((p) => p.id === id)
    if (item) item.updated_at = NOW_ISO
    return wait(note)
  },

  finishNote(id: string, noteId: string) {
    const note = requireNote(id, noteId)
    note.locked_at = NOW_ISO
    note.updated_at = NOW_ISO
    syncListItem(id)
    return wait(note)
  },

  deleteNote(id: string, noteId: string) {
    evolutions[id].notes = evolutions[id].notes.filter((n) => n.id !== noteId)
    syncListItem(id)
    return wait(true)
  },

  setArchived(id: string, archived: boolean) {
    evolutions[id].archived_at = archived ? NOW_ISO : null
    syncListItem(id)
    return wait(true)
  },

  generateSummary: (id: string) => wait(SUMMARIES[id] ?? SUMMARIES.maria),
}
