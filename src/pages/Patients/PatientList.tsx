import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Archive, ArchiveRestore, MoreVertical, Plus, Search, Sparkles, Users, X } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Watermark } from '@/components/layout/Watermark'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Menu, MenuItem } from '@/components/ui/Menu'
import { Segmented } from '@/components/ui/Segmented'
import { StatusChip } from '@/components/ui/StatusChip'
import { NOW_ISO } from '@/lib/clock'
import { formatLongDate } from '@/lib/dates'
import { groupByStatus, noteStatus, statusLabel } from '@/lib/noteStatus'
import { CONTEXT_LABEL, bedLabel, displayName } from '@/lib/patient'
import { api } from '@/services/api'
import { SUMMARIES } from '@/mocks/ai'
import { type PatientListItem } from '@/types'
import btn from '@/components/ui/Button.module.css'
import s from './PatientList.module.css'
import { Divider } from '@/components/ui/Divider'

function primaryAction(p: PatientListItem) {
  const status = noteStatus(p)
  if (status === 'draft') return 'Continuar'
  if (status === 'finished' || (p.archived_at && p.last_note_at)) return 'Ver nota'
  return 'Iniciar'
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
  const open = async () => {
    // Só "Iniciar" cria nota: abrir um paciente para consulta não deixa rascunho vazio.
    if (action === 'Iniciar') await api.createNote(p.id)
    navigate(`/evolucoes/${p.id}`)
  }
  const details = [
    p.patient_age != null && `${p.patient_age} anos`,
    p.patient_sex,
    p.patient_record && `Pront. ${p.patient_record}`,
  ]
    .filter(Boolean)
    .join(' · ')
  return (
    <article className={s.card}>
      <div className={s.cardRow}>
        <div className={s.identity}>
          <Avatar src={p.photo_avatar} status={p.health_status} size={44} />
          <div className={s.identityText}>
            <div className={s.name}>
              {displayName(p)}
              {p.archived_at && <Badge tone="archived">Arquivado</Badge>}
            </div>
            <div className={s.details}>{details}</div>
          </div>
        </div>
        <div className={s.place}>
          <div className={s.bed}>{bedLabel(p)}</div>
          <div className={s.sector}>{CONTEXT_LABEL[p.context]}</div>
        </div>
        <div className={s.chip}>
          <StatusChip tone={noteStatus(p)}>{statusLabel(p)}</StatusChip>
        </div>
        <div className={s.actions}>
          <Button
            variant={action === 'Ver nota' ? 'secondary' : 'primary'}
            className={s.action}
            onClick={() => void open()}
          >
            {action}
          </Button>
          <Menu
            open={props.menuOpen}
            trigger={
              <button type="button" className={s.kebab} aria-label={`Ações de ${displayName(p)}`}>
                <MoreVertical size={18} aria-hidden />
              </button>
            }
          >
            <MenuItem onSelect={props.onSummary}>
              <Sparkles size={16} strokeWidth={1.5} aria-hidden />
              Gerar resumo
            </MenuItem>
            <Divider />
            <MenuItem onSelect={() => void api.setArchived(p.id, !p.archived_at).then(props.onChanged)}>
              {p.archived_at ? (
                <ArchiveRestore size={16} strokeWidth={1.5} aria-hidden />
              ) : (
                <Archive size={16} strokeWidth={1.5} aria-hidden />
              )}
              {p.archived_at ? 'Desarquivar' : 'Arquivar'}
            </MenuItem>
          </Menu>
        </div>
      </div>
      {props.summary && <div className={s.summary}>{props.summary}</div>}
    </article>
  )
}

export function PatientList() {
  const [params] = useSearchParams()
  const viewState = params.get('state')
  const menuParam = params.get('menu')
  const [patients, setPatients] = useState<PatientListItem[] | null>(null)
  const [query, setQuery] = useState(params.get('search') ?? '')
  const [tab, setTab] = useState<'today' | 'archived'>(params.has('archived') ? 'archived' : 'today')
  const summaryParam = params.get('summary')
  const [summaries, setSummaries] = useState<Record<string, string>>(
    summaryParam ? { [summaryParam]: SUMMARIES[summaryParam] } : {},
  )

  const load = () => void api.listPatients().then(setPatients)
  useEffect(() => {
    if (viewState === 'loading') return
    if (viewState === 'empty') {
      setPatients([])
      return
    }
    load()
  }, [viewState])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (patients ?? []).filter((p) => {
      if (Boolean(p.archived_at) !== (tab === 'archived')) return false
      if (!q) return true
      return [p.patient_name, p.patient_initials, p.patient_bed].some((f) => f?.toLowerCase().includes(q))
    })
  }, [patients, query, tab])

  const generate = (id: string) =>
    void api.generateSummary(id).then((t) => setSummaries((c) => ({ ...c, [id]: t })))

  const header = <AppHeader title="Evoluções" back="/evolucoes" icon={false} />

  if (!patients) {
    return (
      <>
        {header}
        <Watermark>
          <div className={s.main}>
            <div className={s.loading}>
              Carregando evoluções...
            </div>
          </div>
        </Watermark>
      </>
    )
  }

  const firstAccess = patients.length === 0
  const today = groupByStatus(patients)
  const shown = groupByStatus(visible)
  const archivedCount = patients.filter((p) => p.archived_at).length
  const doneCount = today.finished.length
  const todoTitle =
    today.todo.length === 0
      ? 'Nenhuma evolução para fazer hoje'
      : `${today.todo.length} ${today.todo.length === 1 ? 'evolução' : 'evoluções'} para fazer hoje`

  const card = (p: PatientListItem) => (
    <PatientCard
      key={p.id}
      patient={p}
      menuOpen={menuParam === p.id ? true : undefined}
      summary={summaries[p.id]}
      onSummary={() => generate(p.id)}
      onChanged={load}
    />
  )
  const section = (title: string, items: PatientListItem[]) =>
    items.length > 0 && (
      <section className={s.section}>
        <h3 className={s.sectionTitle}>
          {title} · {items.length}
        </h3>
        <div className={s.cards}>{items.map(card)}</div>
      </section>
    )

  return (
    <>
      {header}
      <Watermark>
        <main className={s.main}>
          <div className={s.top}>
            <div>
              <div className={s.date}>{formatLongDate(NOW_ISO)}</div>
              <h2 className={s.heading}>{firstAccess ? 'Pacientes' : todoTitle}</h2>
              {!firstAccess && (
                <div className={s.progress}>
                  <progress
                    className={s.progressBar}
                    max={Math.max(today.total, 1)}
                    value={doneCount}
                    aria-label="Evoluções finalizadas hoje"
                  />
                  {doneCount} de {today.total} {doneCount > 1 ? 'finalizadas' : 'finalizada'}
                </div>
              )}
            </div>
            <Link
              to="/evolucoes/novo"
              className={`${btn.button} ${btn.primary} ${s.add}`}
              aria-label="Adicionar paciente"
            >
              <Plus size={18} aria-hidden />
              <span className={s.addLong}>Adicionar paciente</span>
              <span className={s.addShort}>Paciente</span>
            </Link>
          </div>

          {firstAccess ? (
            <div className={`${s.empty} ${s.firstEmpty}`}>
              <div className={s.emptyBox}>
                <Users size={50} strokeWidth={1.75} aria-hidden />
              </div>
              <div className={s.emptyTitle}>Nenhum paciente</div>
              <p className={s.emptyText}>
                Use o botão “Adicionar paciente” para registrar suas evoluções clínicas. Você pode começar em
                um dispositivo e continuar em outro com o pareamento por código.
              </p>
            </div>
          ) : (
            <>
              <div className={s.filters}>
                <div className={s.search}>
                  <Search className={s.searchIcon} size={18} aria-hidden />
                  <input
                    aria-label="Buscar paciente"
                    placeholder="Buscar por nome, iniciais ou leito"
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
                      <X size={14} aria-hidden />
                    </button>
                  )}
                </div>
                <div className={s.tabs}>
                  <Segmented
                    label="Pacientes"
                    value={tab}
                    onChange={setTab}
                    options={[
                      { value: 'today', label: `Hoje · ${today.total}` },
                      { value: 'archived', label: `Arquivados · ${archivedCount}` },
                    ]}
                  />
                </div>
              </div>

              {visible.length === 0 ? (
                <div className={s.empty}>
                  <div className={s.emptyBox}>
                    <Search size={32} strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className={s.emptyTitle}>Nenhum resultado</div>
                  <p className={s.emptyText}>
                    {query.trim()
                      ? 'Nenhum paciente corresponde à busca. Ajuste o nome, as iniciais ou o leito.'
                      : 'Nenhum paciente nesta aba.'}
                  </p>
                </div>
              ) : tab === 'archived' ? (
                <div className={`${s.cards} ${s.section}`}>{visible.map(card)}</div>
              ) : (
                <>
                  {section('A fazer', shown.todo)}
                  {section('Finalizadas hoje', shown.finished)}
                </>
              )}
            </>
          )}
        </main>
      </Watermark>
    </>
  )
}
