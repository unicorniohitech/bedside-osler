import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArchiveRestore,
  FileText,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { AppHeader } from '../components/layout/AppHeader'
import { Watermark } from '../components/layout/Watermark'
import { Badge } from '../components/ui/Badge'
import { Menu, MenuItem } from '../components/ui/Menu'
import { Switch } from '../components/ui/Switch'
import { formatDateTime } from '../lib/dates'
import { SEX_LABEL, displayName, sectorLine } from '../lib/patient'
import { api } from '../services/api'
import { SUMMARIES } from '../mocks/ai'
import type { PatientListItem } from '../types'
import btn from '../components/ui/Button.module.css'
import s from './PatientList.module.css'

function primaryAction(p: PatientListItem) {
  if (!p.last_note_at) return { label: 'Iniciar', Icon: Plus }
  if (p.last_note_locked_at) return { label: 'Abrir', Icon: FileText }
  return { label: 'Continuar', Icon: Pencil }
}

function PatientCard(props: {
  patient: PatientListItem
  menuOpen?: boolean
  summary?: string
  onSummary: () => void
  onChanged: () => void
}) {
  const { patient: p } = props
  const navigate = useNavigate()
  const action = primaryAction(p)
  return (
    <article className={s.card}>
      <div className={s.name}>
        {displayName(p)}
        {p.archived_at && <Badge tone="archived">Arquivado</Badge>}
      </div>
      <div className={s.sector}>{sectorLine(p)}</div>
      <div className={s.meta}>
        {p.patient_age != null && (
          <span>
            <b>Idade:</b> {p.patient_age} anos
          </span>
        )}
        {p.patient_sex && (
          <span>
            <b>Sexo:</b> {SEX_LABEL[p.patient_sex]}
          </span>
        )}
        {p.patient_record && (
          <span>
            <b>Prontuário:</b> {p.patient_record}
          </span>
        )}
        <span>
          <b>Atualizado:</b> {formatDateTime(p.updated_at)}
        </span>
      </div>
      {props.summary && <div className={s.summary}>{props.summary}</div>}
      <Menu
        open={props.menuOpen}
        trigger={
          <button type="button" className={s.kebab} aria-label={`Ações de ${displayName(p)}`}>
            <MoreVertical size={16} aria-hidden />
          </button>
        }
      >
        <MenuItem onSelect={() => navigate(`/evolucoes/${p.id}`)}>
          <action.Icon size={16} strokeWidth={1.5} aria-hidden />
          {action.label}
        </MenuItem>
        <MenuItem onSelect={props.onSummary}>
          <Sparkles size={16} strokeWidth={1.5} aria-hidden />
          Gerar resumo
        </MenuItem>
        {p.archived_at && (
          <MenuItem onSelect={() => void api.setArchived(p.id, false).then(props.onChanged)}>
            <ArchiveRestore size={16} strokeWidth={1.5} aria-hidden />
            Desarquivar
          </MenuItem>
        )}
      </Menu>
    </article>
  )
}

export function PatientList() {
  const [params] = useSearchParams()
  const estado = params.get('estado')
  const menuParam = params.get('menu')
  const [patients, setPatients] = useState<PatientListItem[] | null>(null)
  const [query, setQuery] = useState(params.get('busca') ?? '')
  const [showArchived, setShowArchived] = useState(params.has('arquivados'))
  const resumoParam = params.get('resumo')
  const [summaries, setSummaries] = useState<Record<string, string>>(
    resumoParam ? { [resumoParam]: SUMMARIES[resumoParam] } : {},
  )

  const load = () => void api.listPatients().then(setPatients)
  useEffect(() => {
    if (estado === 'carregando') return
    if (estado === 'vazio') {
      setPatients([])
      return
    }
    load()
  }, [estado])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (patients ?? []).filter((p) => {
      if (p.archived_at && !showArchived) return false
      if (!q) return true
      return [p.patient_name, p.patient_initials, p.patient_bed].some((f) => f?.toLowerCase().includes(q))
    })
  }, [patients, query, showArchived])

  const generate = (id: string) =>
    void api.generateSummary(id).then((t) => setSummaries((c) => ({ ...c, [id]: t })))

  const header = <AppHeader title="Evoluções" back="/evolucoes" />

  if (!patients) {
    return (
      <>
        {header}
        <Watermark>
          <div className={s.main}>
            <div className={s.loading} style={{ margin: '0 0 0 -181px' }}>
              Buscando papel e brigando com a impressora...
            </div>
          </div>
        </Watermark>
      </>
    )
  }

  const firstAccess = patients.length === 0

  return (
    <>
      {header}
      <Watermark>
        <main className={s.main}>
          <section className={s.panel}>
            <div className={s.top}>
              <h2 className={s.heading}>
                <Users size={24} strokeWidth={1.75} aria-hidden />
                Pacientes
              </h2>
              <Link
                to="/evolucoes/novo"
                className={`${btn.button} ${btn.primary}`}
                style={{ textDecoration: 'none' }}
              >
                <Plus size={16} aria-hidden />
                Adicionar paciente
              </Link>
            </div>

            {firstAccess ? (
              <div className={`${s.empty} ${s.firstEmpty}`}>
                <div className={s.emptyBox}>
                  <Users size={50} strokeWidth={1.75} aria-hidden />
                </div>
                <div className={s.emptyTitle}>Nenhum paciente</div>
                <p className={s.emptyText}>
                  Use o botão “Adicionar paciente”, aqui em cima, para registrar suas evoluções clínicas. Você
                  pode começar em um dispositivo e continuar em outro com o pareamento por código.
                </p>
              </div>
            ) : (
              <>
                <div className={s.filters}>
                  <div className={s.search}>
                    <Search className={s.searchIcon} size={14} aria-hidden />
                    <input
                      aria-label="Buscar paciente"
                      placeholder="Buscar paciente, leito, iniciais..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <button
                        type="button"
                        className={s.clear}
                        aria-label="Limpar busca"
                        onClick={() => setQuery('')}
                      >
                        <X size={13} aria-hidden />
                      </button>
                    )}
                  </div>
                  <label className={s.toggle}>
                    <Switch checked={showArchived} onCheckedChange={setShowArchived} />
                    Mostrar arquivados
                  </label>
                </div>

                {visible.length ? (
                  <div className={s.cards}>
                    {visible.map((p) => (
                      <PatientCard
                        key={p.id}
                        patient={p}
                        menuOpen={menuParam === p.id ? true : undefined}
                        summary={summaries[p.id]}
                        onSummary={() => generate(p.id)}
                        onChanged={load}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={s.empty}>
                    <div className={s.emptyBox}>
                      <Search size={32} strokeWidth={1.75} aria-hidden />
                    </div>
                    <div className={s.emptyTitle}>Nenhum resultado</div>
                    <p className={s.emptyText}>
                      Nenhum paciente corresponde aos filtros atuais. Ajuste a busca ou os filtros para ver
                      mais.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </Watermark>
    </>
  )
}
