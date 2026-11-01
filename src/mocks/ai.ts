// Textos copiados literalmente das telas 05, 30, 31 e 34.
export const SUMMARIES: Record<string, string> = {
  maria:
    'Idosa de 78 anos com DPOC GOLD 3, internada há 5 dias por pneumonia comunitária em base direita. Melhora clínica e laboratorial (PCR de 18,2 para 6,4; leucócitos de 16.400 para 9.800; creatinina de 1,4 para 1,0). Em desmame de O2 a 2 L/min. Alta prevista para 30/10.',
}

export const COMPANION = {
  analyzedAt: '2026-10-28T11:02:00Z',
  alerts: [
    {
      level: 'warning' as const,
      title: 'SatO2 acima do alvo para DPOC',
      anchor: { field: 'sat_o2' },
      text: 'SatO2 de 93% em cateter a 2 L/min. Em paciente que retém CO2, o alvo é de 88 a 92%: dá para reduzir o fluxo.',
    },
    {
      level: 'info' as const,
      title: 'Azitromicina termina amanhã',
      anchor: { text: 'azitromicina 500 mg/dia' },
      text: 'Iniciada em 24/10. A nota de hoje marca o 4º de 5 dias.',
    },
    {
      level: 'info' as const,
      title: 'Função renal normalizou',
      anchor: { text: 'Cr 1,0' },
      text: 'Creatinina de 1,4 em 24/10 para 1,0 em 28/10.',
    },
  ],
  points: [
    {
      priority: 'high' as const,
      title: 'Gasometria arterial antes de reduzir o O2?',
      text: 'Nenhuma gasometria registrada desde a admissão.',
    },
    {
      priority: 'medium' as const,
      title: 'Profilaxia de trombose prescrita?',
      text: 'Não aparece nas notas, e a paciente ficou acamada nos primeiros dias.',
    },
    {
      priority: 'low' as const,
      title: 'Vacinas contra influenza e pneumococo em dia?',
      text: 'Vale registrar na alta de paciente com DPOC.',
    },
  ],
}

export const HANDOFF = {
  generatedAt: '2026-10-28T11:06:00Z',
  meta: 'Enfermaria · Leito 412B · Prontuário 2024118734 · 4 notas',
  sections: [
    {
      title: 'HISTÓRIA E ADMISSÃO',
      text: 'Maria, 78 anos, com DPOC GOLD 3 e hipertensão, internada em 24/10 por pneumonia comunitária em base direita, após 4 dias de febre, tosse produtiva e piora da falta de ar.',
    },
    {
      title: 'EVOLUÇÃO',
      text: 'Recebeu ceftriaxona e azitromicina desde a admissão. Teve febre até 26/10 e, desde então, melhora progressiva da falta de ar e da tosse. Começou fisioterapia respiratória em 27/10.',
    },
    {
      title: 'EXAMES COMPLEMENTARES',
      text: 'PCR caiu de 18,2 para 6,4 e os leucócitos de 16.400 para 9.800. Creatinina normalizou (1,4 para 1,0). RX de 27/10 com redução da consolidação. Hemoculturas sem crescimento.',
    },
    {
      title: 'ESTADO ATUAL',
      text: 'Afebril, eupneica, com SatO2 de 93% em cateter nasal a 2 L/min, sinais vitais estáveis e aceitando dieta pastosa.',
    },
    {
      title: 'IMPRESSÃO',
      text: 'Pneumonia comunitária em resolução em paciente com DPOC, sem complicações.',
    },
    {
      title: 'PLANO E PENDÊNCIAS',
      text: 'Completar ceftriaxona até 31/10, suspender azitromicina amanhã, reduzir o O2 para o alvo de 88 a 92% e programar alta para 30/10.',
    },
  ],
}
