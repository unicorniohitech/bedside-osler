import {
  Archive,
  BookOpen,
  Calculator,
  ClipboardList,
  FilePenLine,
  FileText,
  FlaskConical,
  ListOrdered,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export type ToolId =
  'history' | 'companion' | 'handoff' | 'flowchart' | 'cid' | 'calc' | 'templates' | 'lme' | 'archive'

export const TOOLS: { id: ToolId; label: string; Icon: LucideIcon }[] = [
  { id: 'history', label: 'Histórico', Icon: ListOrdered },
  { id: 'companion', label: 'Osler Companion', Icon: Sparkles },
  { id: 'handoff', label: 'Passar caso', Icon: ClipboardList },
  { id: 'flowchart', label: 'Fluxograma de lab', Icon: FlaskConical },
  { id: 'cid', label: 'CID-10', Icon: BookOpen },
  { id: 'calc', label: 'Calculadoras', Icon: Calculator },
  { id: 'templates', label: 'Templates', Icon: FileText },
  { id: 'lme', label: 'LME / APAC', Icon: FilePenLine },
  { id: 'archive', label: 'Arquivar paciente', Icon: Archive },
]
