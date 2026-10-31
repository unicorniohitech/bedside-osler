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
  'historico' | 'companion' | 'passar' | 'fluxograma' | 'cid' | 'calc' | 'templates' | 'lme' | 'arquivar'

export const TOOLS: { id: ToolId; label: string; Icon: LucideIcon }[] = [
  { id: 'historico', label: 'Histórico', Icon: ListOrdered },
  { id: 'companion', label: 'Osler Companion', Icon: Sparkles },
  { id: 'passar', label: 'Passar caso', Icon: ClipboardList },
  { id: 'fluxograma', label: 'Fluxograma de lab', Icon: FlaskConical },
  { id: 'cid', label: 'CID-10', Icon: BookOpen },
  { id: 'calc', label: 'Calculadoras', Icon: Calculator },
  { id: 'templates', label: 'Templates', Icon: FileText },
  { id: 'lme', label: 'LME / APAC', Icon: FilePenLine },
  { id: 'arquivar', label: 'Arquivar paciente', Icon: Archive },
]
