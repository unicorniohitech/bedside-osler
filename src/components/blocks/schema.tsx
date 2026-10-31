import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { Activity, Calculator, Check, Mic, X } from 'lucide-react'
import { VITAL_FIELDS } from '../../lib/noteText'
import { SECTION_ICONS } from './sectionIcons'
import s from './blocks.module.css'

const SectionHeaderBlock = createReactBlockSpec(
  {
    type: 'sectionHeader',
    propSchema: { title: { default: '' }, icon: { default: 'subjective' } },
    content: 'none',
  },
  {
    render: ({ block, editor }) => {
      const Icon = SECTION_ICONS[block.props.icon] ?? SECTION_ICONS.subjective
      return (
        <div className={s.section}>
          <Icon size={16} strokeWidth={1.5} aria-hidden />
          {editor.isEditable ? (
            <input
              className={s.sectionInput}
              aria-label="Título da seção"
              value={block.props.title}
              onChange={(e) => editor.updateBlock(block, { props: { title: e.target.value } })}
            />
          ) : (
            block.props.title
          )}
        </div>
      )
    },
  },
)

const VitalsBlock = createReactBlockSpec(
  {
    type: 'vitals',
    propSchema: {
      pa: { default: '' },
      fc: { default: '' },
      fr: { default: '' },
      sat_o2: { default: '' },
      temperatura: { default: '' },
      dor: { default: '' },
    },
    content: 'none',
  },
  {
    render: ({ block, editor }) => (
      <div className={s.box}>
        <div className={s.label}>
          <Activity size={14} strokeWidth={1.75} aria-hidden />
          SINAIS VITAIS
        </div>
        <div className={s.vitalsGrid}>
          {VITAL_FIELDS.map((f) => (
            <label key={f.key} className={s.vital}>
              {f.label}
              <input
                value={block.props[f.key]}
                readOnly={!editor.isEditable}
                onChange={(e) => editor.updateBlock(block, { props: { [f.key]: e.target.value } })}
              />
            </label>
          ))}
        </div>
      </div>
    ),
  },
)

const DictationBlock = createReactBlockSpec(
  {
    type: 'dictation',
    propSchema: { transcribed_text: { default: '' } },
    content: 'none',
  },
  {
    render: ({ block, editor }) => {
      const apply = () =>
        editor.replaceBlocks([block], [
          { type: 'paragraph', content: block.props.transcribed_text },
        ] as unknown as Parameters<typeof editor.replaceBlocks>[1])
      return (
        <div className={s.box}>
          <div className={s.label}>
            <Mic size={14} strokeWidth={1.75} aria-hidden />
            DITADO
          </div>
          <textarea
            className={s.dictationText}
            aria-label="Texto ditado"
            value={block.props.transcribed_text}
            readOnly={!editor.isEditable}
            onChange={(e) => editor.updateBlock(block, { props: { transcribed_text: e.target.value } })}
          />
          <div className={s.dictationActions}>
            <button type="button">
              <Mic size={14} strokeWidth={1.75} aria-hidden />
              Iniciar gravação
            </button>
            <button type="button" onClick={apply}>
              <Check size={14} strokeWidth={1.75} aria-hidden />
              Aplicar como texto
            </button>
            <button type="button" className={s.ghost} onClick={() => editor.removeBlocks([block])}>
              <X size={14} strokeWidth={1.75} aria-hidden />
              Descartar
            </button>
          </div>
        </div>
      )
    },
  },
)

const CalcResultBlock = createReactBlockSpec(
  {
    type: 'calcResult',
    propSchema: { calc_id: { default: '' }, label: { default: '' }, captured_text: { default: '' } },
    content: 'none',
  },
  {
    render: ({ block }) => (
      <div className={`${s.box} ${s.calcBox}`}>
        <div className={`${s.label} ${s.calcLabel}`}>
          <Calculator size={14} strokeWidth={1.75} aria-hidden />
          CALCULADORA
        </div>
        <div className={s.calcTitle}>{block.props.label}</div>
        <div className={s.calcText}>{block.props.captured_text}</div>
      </div>
    ),
  },
)

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    sectionHeader: SectionHeaderBlock(),
    vitals: VitalsBlock(),
    dictation: DictationBlock(),
    calcResult: CalcResultBlock(),
  },
})

export type BedsideEditor = typeof schema.BlockNoteEditor
