import {
  Archive,
  BookOpen,
  Calculator,
  ClipboardList,
  ExternalLink,
  FileText,
  FlaskConical,
  ListOrdered,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export type ToolId =
  'history' | 'companion' | 'handoff' | 'flowchart' | 'cid' | 'calc' | 'templates' | 'lme' | 'archive'

export type ToolGroup = 'history' | 'consult' | 'insert' | 'other'

export const TOOLS: {
  id: ToolId
  label: string
  shortLabel: string
  group: ToolGroup
  shortcut?: string
  Icon: LucideIcon
}[] = [
  { id: 'history', label: 'Histórico', shortLabel: 'Histórico', group: 'history', Icon: ListOrdered },
  { id: 'companion', label: 'Osler Companion', shortLabel: 'Osler', group: 'consult', Icon: Sparkles },
  { id: 'handoff', label: 'Passar caso', shortLabel: 'Passar', group: 'consult', Icon: ClipboardList },
  { id: 'flowchart', label: 'Fluxograma de lab', shortLabel: 'Lab', group: 'consult', Icon: FlaskConical },
  { id: 'cid', label: 'CID-10', shortLabel: 'CID-10', group: 'insert', shortcut: '/cid', Icon: BookOpen },
  { id: 'calc', label: 'Calculadoras', shortLabel: 'Calc', group: 'insert', shortcut: '/calc', Icon: Calculator },
  { id: 'templates', label: 'Templates', shortLabel: 'Templates', group: 'insert', shortcut: '/template', Icon: FileText },
  { id: 'lme', label: 'LME / APAC', shortLabel: 'LME', group: 'other', Icon: ExternalLink },
  { id: 'archive', label: 'Arquivar paciente', shortLabel: 'Arquivar', group: 'other', Icon: Archive },
]

export const toolsOf = (group: ToolGroup) => TOOLS.filter((t) => t.group === group)
