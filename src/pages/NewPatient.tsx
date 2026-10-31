import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import * as Select from '@radix-ui/react-select'
import { ArrowRight, ChevronDown, Users } from 'lucide-react'
import { AppHeader } from '../components/layout/AppHeader'
import { Watermark } from '../components/layout/Watermark'
import { Button } from '../components/ui/Button'
import { Segmented } from '../components/ui/Segmented'
import { formatInitials } from '../lib/iniciais'
import { CONTEXT_LABEL } from '../lib/patient'
import { api } from '../services/api'
import type { Context, Sex } from '../types'
import btn from '../components/ui/Button.module.css'
import s from './NewPatient.module.css'

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
  const sample = params.has('exemplo')
  const navigate = useNavigate()
  const [context, setContext] = useState<Context>(sample ? 'ps' : 'enfermaria')
  const [name, setName] = useState(sample ? 'Luana Beatriz Moreira Costa' : '')
  const [initials, setInitials] = useState(sample ? 'L.B.M.C.' : '')
  const [age, setAge] = useState(sample ? '31' : '')
  const [sex, setSex] = useState<Sex | undefined>()
  const [bed, setBed] = useState(sample ? 'PS 3' : '')
  const [record, setRecord] = useState('')
  const canCreate = Boolean(name.trim() || initials.trim())

  const submit = async () => {
    const id = await api.createPatient({
      context,
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

            <span className={s.ctxLabel}>Contexto clínico</span>
            <Segmented label="Contexto clínico" value={context} options={CONTEXTS} onChange={setContext} />

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
                id="iniciais"
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
                <Select.Root value={sex} onValueChange={(v) => setSex(v as Sex)}>
                  <Select.Trigger className={`${s.input} ${s.select}`} aria-labelledby="sexo-label">
                    <Select.Value placeholder="Selecione..." />
                    <Select.Icon>
                      <ChevronDown size={16} strokeWidth={1.5} color="#6c6c6c" aria-hidden />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className={s.selectContent} position="popper" sideOffset={4}>
                      <Select.Viewport>
                        <Select.Item value="F" className={s.selectItem}>
                          <Select.ItemText>Feminino</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="M" className={s.selectItem}>
                          <Select.ItemText>Masculino</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              <Field id="leito" label="Leito" placeholder="Ex: 12B" value={bed} onChange={setBed} />
            </div>

            <div className={s.recordRow}>
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
