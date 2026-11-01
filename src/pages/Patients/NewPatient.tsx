import { useRef, useState, type ChangeEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Upload, Users, X } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Watermark } from '@/components/layout/Watermark'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { formatInitials } from '@/lib/initials'
import { CONTEXT_LABEL } from '@/lib/patient'
import { api } from '@/services/api'
import type { Context, Sex } from '@/types'
import btn from '@/components/ui/Button.module.css'
import s from './NewPatient.module.css'

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'F', label: 'Feminino' },
  { value: 'M', label: 'Masculino' },
]

const CONTEXTS = (['ps', 'enfermaria', 'uti', 'ambulatorio', 'consultorio', 'outro'] as Context[]).map(
  (value) => ({
    value,
    label: CONTEXT_LABEL[value],
  }),
)

function Field(props: {
  id: string
  label: string
  hint?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  inputMode?: 'numeric'
}) {
  return (
    <div className={s.field}>
      <label className={s.labelRow} htmlFor={props.id}>
        <b>{props.label}</b>
        {props.hint && <small>{props.hint}</small>}
      </label>
      <input
        id={props.id}
        className={s.input}
        placeholder={props.placeholder}
        value={props.value}
        inputMode={props.inputMode}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  )
}

export function NewPatient() {
  const [params] = useSearchParams()
  const sample = params.has('sample')
  const navigate = useNavigate()
  const [context, setContext] = useState<Context>(sample ? 'ps' : 'enfermaria')
  const [name, setName] = useState(sample ? 'Luana Beatriz Moreira Costa' : '')
  const [initials, setInitials] = useState(sample ? 'L.B.M.C.' : '')
  const [age, setAge] = useState(sample ? '31' : '')
  const [sex, setSex] = useState<Sex | undefined>()
  const [bed, setBed] = useState(sample ? 'PS 3' : '')
  const [record, setRecord] = useState('')
  const [avatar, setAvatar] = useState<string | undefined>()
  const avatarInput = useRef<HTMLInputElement>(null)
  const canCreate = Boolean(name.trim() || initials.trim())

  const pickAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const submit = async () => {
    const id = await api.createPatient({
      context,
      photo_avatar: avatar,
      patient_name: name.trim() || undefined,
      patient_initials: initials || undefined,
      patient_age: age ? Number(age) : undefined,
      patient_sex: sex,
      patient_bed: bed.trim() || undefined,
      patient_record: record.trim() || undefined,
    })
    navigate(`/evolucoes/${id}`)
  }

  return (
    <>
      <AppHeader title="Adicionar paciente" back="/evolucoes" icon={false} />
      <Watermark>
        <main className={s.main}>
          <section className={s.panel}>
            <h2 className={s.heading}>
              <Users size={24} strokeWidth={1.75} aria-hidden />
              Adicionar paciente
            </h2>
            <p className={s.sub}>Informe pelo menos o nome ou as iniciais. Você pode editar tudo depois.</p>
            <div className={s.ctxSelect}>
              <label className={s.ctxLabel} id="sexo-label">
                <b>Contexto clínico</b>
              </label>
              <Select
                value={context}
                onChange={setContext}
                options={CONTEXTS}
                placeholder="Selecione..."
                labelledBy="sexo-label"
              />
            </div>
            {/* <span className={s.ctxLabel}>Contexto clínico</span>
            <Segmented label="Contexto clínico" value={context} options={CONTEXTS} onChange={setContext} /> */}

            <div className={`${s.field} ${s.avatarField}`}>
              <label className={s.labelRow} htmlFor="avatar">
                <b>Foto do paciente</b>
                <small>Opcional</small>
              </label>
              <div className={s.avatarRow}>
                <Avatar src={avatar} size={64} alt="Foto do paciente" />
                <input
                  ref={avatarInput}
                  id="avatar"
                  className={s.avatarInput}
                  type="file"
                  accept="image/*"
                  onChange={pickAvatar}
                />
                <div className={s.avatarActions}>
                  <Button variant="secondary" onClick={() => avatarInput.current?.click()}>
                    <Upload size={16} aria-hidden />
                    {avatar ? 'Trocar imagem' : 'Escolher imagem'}
                  </Button>
                  {avatar && (
                    <Button variant="secondary" onClick={() => setAvatar(undefined)}>
                      <X size={16} aria-hidden />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className={s.row2}>
              <Field
                id="nome"
                label="Nome do paciente"
                hint="Opcional se houver iniciais"
                placeholder="Nome completo"
                value={name}
                onChange={setName}
              />
              <Field
                id="initials"
                label="Iniciais"
                hint="Opcional se houver nome"
                placeholder="Ex: J.S.M."
                value={initials}
                onChange={(v) => setInitials(formatInitials(v))}
              />
            </div>

            <div className={s.row3}>
              <Field
                id="idade"
                label="Idade"
                placeholder="anos"
                value={age}
                inputMode="numeric"
                onChange={(v) => setAge(v.replace(/\D/g, ''))}
              />
              <div className={`${s.field} ${s.sexField}`}>
                <label className={s.labelRow} id="sexo-label">
                  <b>Sexo</b>
                </label>
                <Select
                  value={sex}
                  onChange={setSex}
                  options={SEX_OPTIONS}
                  placeholder="Selecione..."
                  labelledBy="sexo-label"
                />
              </div>
            </div>

            <div className={s.row3}>
              <Field id="bed" label="Leito" placeholder="Ex: 12B" value={bed} onChange={setBed} />
              <Field
                id="prontuario"
                label="Prontuário"
                hint="Opcional"
                placeholder="Número do prontuário"
                value={record}
                onChange={setRecord}
              />
            </div>

            <div className={s.actions}>
              <Link to="/evolucoes" className={`${btn.button} ${btn.secondary}`}>
                Cancelar
              </Link>
              <Button disabled={!canCreate} onClick={() => void submit()}>
                <ArrowRight size={16} aria-hidden />
                Criar e abrir editor
              </Button>
            </div>
          </section>
        </main>
      </Watermark>
    </>
  )
}
