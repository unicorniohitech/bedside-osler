import { Link } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { StatusDot } from '../ui/StatusChip'
import { STATUS_SHORT_LABEL, noteStatus } from '@/lib/noteStatus'
import { displayName } from '@/lib/patient'
import type { PatientListItem } from '@/types'
import s from './TodayPatients.module.css'

export function TodayPatients(props: { patients: PatientListItem[]; currentId: string; doneCount: number }) {
  return (
    <nav className={s.column} aria-label="Pacientes de hoje">
      <h2 className={s.title}>
        Hoje · {props.doneCount} de {props.patients.length}
      </h2>
      <ul className={s.list}>
        {props.patients.map((p) => {
          const status = noteStatus(p)
          const current = p.id === props.currentId
          return (
            <li key={p.id}>
              <Link
                to={`/evolucoes/${p.id}`}
                className={`${s.item} ${current ? s.current : ''}`}
                aria-current={current ? 'page' : undefined}
              >
                <Avatar src={p.photo_avatar} status={p.health_status} size={32} />
                <StatusDot status={status} />
                <span className={s.text}>
                  <span className={s.name}>{displayName(p)}</span>
                  <span className={s.meta}>
                    {p.patient_bed ?? 'Sem leito'} · {STATUS_SHORT_LABEL[status]}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
