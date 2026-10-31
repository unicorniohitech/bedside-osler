import * as RadixSwitch from '@radix-ui/react-switch'
import s from './Switch.module.css'

export function Switch(props: { id?: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <RadixSwitch.Root className={s.root} {...props}>
      <RadixSwitch.Thumb className={s.thumb} />
    </RadixSwitch.Root>
  )
}
