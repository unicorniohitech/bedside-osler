import { useNavigate } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { displayName } from '@/lib/patient'
import { api } from '@/services/api'
import type { ToolProps } from './types'
import s from './tools.module.css'

export function ArchivePatient({ evolution, onClose }: ToolProps) {
  const navigate = useNavigate()
  const name = displayName(evolution)
  const archive = () => void api.setArchived(evolution.id, true).then(() => navigate('/evolucoes'))
  return (
    <div className={s.fill}>
      <p className={s.archiveText}>
        Tem certeza que deseja arquivar <strong>{name}</strong>?
      </p>
      <p className={s.archiveText}>
        Arquivar não apaga as evoluções. O paciente continua acessível quando você ativar o filtro{' '}
        <em>"Incluir arquivados"</em> na lista.
      </p>
      <div className={s.spacer} />
      <div className={s.confirm}>
        <div className={s.confirmHead}>
          <TriangleAlert size={16} strokeWidth={1.5} aria-hidden />
          <div>
            <div className={s.confirmTitle}>Arquivar paciente?</div>
            <div className={s.confirmText}>
              {name} sairá da lista padrão. Pode ser recuperado ativando "Incluir arquivados".
            </div>
          </div>
        </div>
        <div className={s.confirmActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={archive}>
            Arquivar
          </Button>
        </div>
      </div>
    </div>
  )
}
