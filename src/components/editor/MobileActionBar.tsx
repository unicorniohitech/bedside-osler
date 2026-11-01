import { ListOrdered, Mic, Wrench } from 'lucide-react'
import { Button } from '../ui/Button'
import s from './MobileActionBar.module.css'

export function MobileActionBar(props: {
  canEdit: boolean
  onHistory: () => void
  onTools: () => void
  onDictate: () => void
  onFinish: () => void
}) {
  return (
    <nav className={s.bar} aria-label="Ações da evolução">
      <button type="button" className={s.item} onClick={props.onHistory}>
        <ListOrdered size={20} strokeWidth={1.75} aria-hidden />
        Histórico
      </button>
      <button type="button" className={s.item} onClick={props.onTools}>
        <Wrench size={20} strokeWidth={1.75} aria-hidden />
        Ferramentas
      </button>
      <button type="button" className={s.item} disabled={!props.canEdit} onClick={props.onDictate}>
        <Mic size={20} strokeWidth={1.75} aria-hidden />
        Ditado
      </button>
      <Button className={s.finish} disabled={!props.canEdit} onClick={props.onFinish}>
        Concluir
      </Button>
    </nav>
  )
}
