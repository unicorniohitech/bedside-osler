import { useMemo, useState } from 'react'
import { Table2, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { extractLabs, isLabTable, labTableBlock } from '@/lib/labs'
import type { NoteBlock } from '@/types'
import type { ToolProps } from './types'
import s from './tools.module.css'

export function LabFlowchart({ evolution, editor }: ToolProps) {
  const sheet = useMemo(() => extractLabs(evolution.notes), [evolution.notes])
  const [off, setOff] = useState<string[]>([])
  const [inserted, setInserted] = useState(() => Boolean(editor?.document().some(isLabTable)))
  const dates = sheet.dates.filter((d) => !off.includes(d))

  const insert = () => {
    if (!editor) return
    const block = labTableBlock(sheet, dates) as NoteBlock
    if (!editor.replaceBlock(isLabTable, block)) editor.insert([block])
    setInserted(true)
  }

  return (
    <div className={s.fill}>
      <div className={s.chips}>
        {sheet.dates.map((d) => {
          const on = !off.includes(d)
          return (
            <button
              key={d}
              type="button"
              className={`${s.chip} ${on ? '' : s.chipOff}`}
              aria-pressed={on}
              onClick={() => setOff((c) => (on ? [...c, d] : c.filter((x) => x !== d)))}
            >
              {d}
              {on && <X size={12} aria-hidden />}
            </button>
          )
        })}
      </div>
      <div className={s.scroll}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th aria-label="Exame" />
                {dates.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.analytes.map((a) => (
                <tr key={a}>
                  <td>{a}</td>
                  {dates.map((d) => (
                    <td key={d}>{sheet.values[d]?.[a] ?? ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={s.endActions}>
        <Button disabled={!dates.length} onClick={insert}>
          <Table2 size={15} aria-hidden />
          {inserted ? 'Atualizar na evolução' : 'Inserir na evolução'}
        </Button>
      </div>
    </div>
  )
}
