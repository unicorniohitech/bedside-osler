import { inlineText, tableRows, VITAL_FIELDS } from '../../lib/noteText'
import { SECTION_ICONS } from '../blocks/sectionIcons'
import type { NoteBlock } from '../../types'
import s from './NoteReadOnly.module.css'

export function NoteReadOnly({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className={s.root}>
      {blocks.map((b, i) => {
        const p = (b.props ?? {}) as Record<string, string>
        switch (b.type) {
          case 'sectionHeader': {
            const Icon = SECTION_ICONS[p.icon] ?? SECTION_ICONS.subjective
            return (
              <div key={i} className={s.section}>
                <Icon size={16} strokeWidth={1.5} aria-hidden />
                {p.title}
              </div>
            )
          }
          case 'vitals':
            return (
              <div key={i} className={s.box}>
                <div className={s.boxTitle}>SINAIS VITAIS</div>
                <div className={s.vitals}>
                  {VITAL_FIELDS.map((f) => (
                    <div key={f.key}>
                      <b>{f.label}</b>
                      {p[f.key]}
                    </div>
                  ))}
                </div>
              </div>
            )
          case 'dictation':
            return (
              <p key={i} className={s.paragraph}>
                {p.transcribed_text}
              </p>
            )
          case 'calcResult':
            return (
              <div key={i} className={s.box}>
                <div className={s.boxTitle}>CALCULADORA</div>
                <div className={s.calcTitle}>{p.label}</div>
                <div className={s.calcText}>{p.captured_text}</div>
              </div>
            )
          case 'bulletListItem':
            return (
              <ul key={i} className={s.list}>
                <li>{inlineText(b)}</li>
              </ul>
            )
          case 'table':
            return (
              <table key={i} className={s.table}>
                <tbody>
                  {tableRows(b).map((row, r) => (
                    <tr key={r}>
                      {row.map((c, k) => (
                        <td key={k}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          default:
            return (
              <p key={i} className={s.paragraph}>
                {inlineText(b)}
              </p>
            )
        }
      })}
    </div>
  )
}
