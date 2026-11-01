import type { Context, HealthStatus, Patient } from '../types'

export const CONTEXT_LABEL: Record<Context, string> = {
  ps: 'Pronto-Socorro',
  enfermaria: 'Enfermaria',
  uti: 'UTI',
  ambulatorio: 'Ambulatório',
  consultorio: 'Consultório',
  outro: 'Outro',
}

export const HEALTH_STATUS_LABEL: Record<HealthStatus, string> = {
  stable: 'Estável',
  under_observation: 'Em observação',
  attention: 'Atenção',
  severe: 'Grave',
  critical: 'Crítico',
}

// "UTI 7" já diz o que é; só um número ou código ganha o prefixo "Leito".
export const bedLabel = (p: Patient) => {
  if (!p.patient_bed) return 'Sem leito'
  return /^[\dA-Za-z]+$/.test(p.patient_bed) ? `Leito ${p.patient_bed}` : p.patient_bed
}

export const displayName = (p: Patient) => p.patient_name || p.patient_initials || ''
