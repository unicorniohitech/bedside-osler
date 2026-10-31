export type Context = 'ps' | 'enfermaria' | 'uti' | 'ambulatorio' | 'consultorio' | 'outro'
export type Sex = 'F' | 'M'

export interface Patient {
  id: string
  owner_id: string
  title: string | null
  created_at: string
  archived_at: string | null
  patient_name?: string
  patient_initials?: string
  patient_age?: number
  patient_sex?: Sex
  patient_bed?: string
  patient_record?: string
  context: Context
}

export interface PatientListItem extends Patient {
  updated_at: string
  last_note_at: string | null
  last_note_locked_at: string | null
}

export interface InlineText {
  type: 'text'
  text: string
  styles: Record<string, unknown>
}

export interface NoteBlock {
  id?: string
  type: string
  props?: Record<string, unknown>
  content?: InlineText[] | unknown
  children?: NoteBlock[]
}

export interface Note {
  id: string
  evolution_id: string
  content: NoteBlock[]
  vitals: unknown
  version: number
  created_at: string
  updated_at: string
  locked_at: string | null
}

export interface Evolution extends Patient {
  notes: Note[]
}

export interface NewPatientInput {
  context: Context
  patient_name?: string
  patient_initials?: string
  patient_age?: number
  patient_sex?: Sex
  patient_bed?: string
  patient_record?: string
}
