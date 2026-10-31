// Tela 40: só os nomes legíveis. O contador de Farmacologia é o da imagem (19), embora só 11 itens apareçam.
export const CALCULATOR_GROUPS = [
  {
    title: 'NEUROLOGIA',
    count: 5,
    items: [
      'Escala NIHSS',
      'Escala de Glasgow Pupilar',
      'Escala de Fisher',
      'ABCD² Score (AIT)',
      'Hunt & Hess (HSA)',
    ].map((name) => ({ id: null as string | null, name })),
  },
  {
    title: 'FARMACOLOGIA',
    count: 19,
    items: [
      'Diluição de Medicamentos',
      'Conversões de Infusão',
      'Conversão de Corticoides',
      'Conversão de Benzodiazepinicos',
      'Dose de Adrenalina',
      'Dose de Dobutamina',
      'Dose de Dopamina',
      'Dose de Nitroglicerina',
      'Dose de Noradrenalina',
      'Dose de Midazolam',
      'Dose de Fentanil',
    ].map((name) => ({ id: null as string | null, name })),
  },
  // Fora da área visível nas telas; é a porta de entrada para a calculadora da tela 41.
  {
    title: 'PNEUMOLOGIA',
    count: 1,
    items: [{ id: 'curb65' as string | null, name: 'CURB-65 (Gravidade de Pneumonia)' }],
  },
]

// Tela 41. Só C e U aparecem na imagem, então só eles existem aqui.
export const CURB65 = {
  id: 'curb65',
  label: 'CURB-65 (Gravidade de Pneumonia)',
  aboutTitle: 'Sobre o CURB-65',
  about: [
    'Estima a mortalidade da pneumonia adquirida na comunidade (PAC) para auxiliar na decisão de tratamento hospitalar vs ambulatorial.',
    'CURB-65: Confusion, Urea, Respiratory rate, Blood pressure, age ≥65.',
    'Diferente do CRB-65, requer dosagem de ureia/BUN.',
  ],
  criteria: [
    { id: 'c', title: 'C - Confusão' },
    { id: 'u', title: 'U - Ureia elevada' },
  ],
}
