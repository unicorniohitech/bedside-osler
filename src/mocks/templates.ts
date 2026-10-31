import type { NoteBlock } from '../types'

const section = (title: string, icon: string): NoteBlock => ({
  type: 'sectionHeader',
  props: { title, icon },
})
const text: NoteBlock = { type: 'paragraph' }
const vitals: NoteBlock = { type: 'vitals' }

// Nomes e descrições da tela 43. O conteúdo não aparece nas imagens: usa os títulos de seção de dados-exemplo.json.
export const TEMPLATES = [
  {
    id: 'soap',
    name: 'SOAP',
    description: 'Subjetivo, Objetivo, Avaliação, Plano',
    blocks: [
      section('Subjetivo', 'subjective'),
      text,
      section('Objetivo', 'physical_exam'),
      text,
      section('Avaliação', 'complementary'),
      text,
      section('Plano', 'plan'),
      text,
    ],
  },
  {
    id: 'anamnese',
    name: 'Anamnese',
    description: 'Anamnese completa para primeiro atendimento',
    blocks: [
      section('Identificação', 'identification'),
      text,
      section('História da doença atual (HDA)', 'history'),
      text,
      section('Antecedentes pessoais', 'history'),
      text,
      section('Exames complementares', 'complementary'),
      text,
      section('Conduta', 'plan'),
      text,
    ],
  },
  {
    id: 'exame',
    name: 'Exame físico',
    description: 'Exame físico geral por sistemas',
    blocks: [section('Exame físico', 'physical_exam'), text],
  },
  {
    id: 'diaria',
    name: 'Evolução diária',
    description: 'Evolução diária de paciente internado',
    blocks: [
      section('Evolução do dia', 'subjective'),
      text,
      section('Sinais vitais', 'vitals'),
      vitals,
      section('Exame físico', 'physical_exam'),
      text,
      section('Exames complementares', 'complementary'),
      text,
      section('Conduta', 'plan'),
      text,
    ],
  },
  {
    id: 'alta',
    name: 'Alta hospitalar',
    description: 'Resumo de alta hospitalar',
    blocks: [section('Resumo de alta', 'discharge'), text],
  },
]
