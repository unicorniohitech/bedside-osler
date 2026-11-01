import type { ComponentType } from 'react'
import { ArchivePatient } from './ArchivePatient'
import { Calculators } from './Calculators'
import { Cid } from './Cid'
import { Companion } from './Companion'
import { LabFlowchart } from './LabFlowchart'
import { NoteHistory } from './NoteHistory'
import { LmeApac } from './LmeApac'
import { CaseHandoff } from './CaseHandoff'
import { Templates } from './Templates'
import type { ToolId } from './registry'
import type { ToolProps } from './types'

export const TOOL_COMPONENTS: Record<ToolId, ComponentType<ToolProps>> = {
  history: NoteHistory,
  companion: Companion,
  handoff: CaseHandoff,
  flowchart: LabFlowchart,
  cid: Cid,
  calc: Calculators,
  templates: Templates,
  lme: LmeApac,
  archive: ArchivePatient,
}
