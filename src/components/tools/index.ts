import type { ComponentType } from 'react'
import { Arquivar } from './Arquivar'
import { Calculadoras } from './Calculadoras'
import { Cid } from './Cid'
import { Companion } from './Companion'
import { Fluxograma } from './Fluxograma'
import { Historico } from './Historico'
import { LmeApac } from './LmeApac'
import { PassarCaso } from './PassarCaso'
import { Templates } from './Templates'
import type { ToolId } from './registry'
import type { ToolProps } from './types'

export const TOOL_COMPONENTS: Record<ToolId, ComponentType<ToolProps>> = {
  historico: Historico,
  companion: Companion,
  passar: PassarCaso,
  fluxograma: Fluxograma,
  cid: Cid,
  calc: Calculadoras,
  templates: Templates,
  lme: LmeApac,
  arquivar: Arquivar,
}
