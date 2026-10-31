export type Context = 'ps' | 'enfermaria' | 'uti' | 'ambulatorio' | 'consultorio' | 'outro'
export type Sex = 'F' | 'M'

// Objeto const no lugar de `enum`: o tsconfig usa erasableSyntaxOnly, que não aceita enum.
export const HealthStatus = {
  Estavel: 'estavel',
  EmObservacao: 'em_observacao',
  Atencao: 'atencao',
  Grave: 'grave',
  Critico: 'critico',
} as const
export type HealthStatus = (typeof HealthStatus)[keyof typeof HealthStatus]

export const HEALTH_STATUS_COLOR: Record<HealthStatus, string> = {
  [HealthStatus.Estavel]: 'var(--status-estavel)',
  [HealthStatus.EmObservacao]: 'var(--status-em-observacao)',
  [HealthStatus.Atencao]: 'var(--status-atencao)',
  [HealthStatus.Grave]: 'var(--status-grave)',
  [HealthStatus.Critico]: 'var(--status-critico)',
}

export interface Patient {
  id: string
  owner_id: string
  title: string | null
  created_at: string
  archived_at: string | null
  photo_avatar?: string
  patient_name?: string
  patient_initials?: string
  patient_age?: number
  patient_sex?: Sex
  patient_bed?: string
  patient_record?: string
  context: Context
  health_status?: HealthStatus
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
