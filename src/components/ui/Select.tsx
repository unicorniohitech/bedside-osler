import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import s from './Select.module.css'

type Props<T extends string> = {
  value?: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  placeholder?: string
  labelledBy?: string
  className?: string
}

export function Select<T extends string>({ value, onChange, options, placeholder, labelledBy, className }: Props<T>) {
  return (
    <RadixSelect.Root value={value} onValueChange={(v) => onChange(v as T)}>
      <RadixSelect.Trigger className={`${s.trigger} ${className ?? ''}`} aria-labelledby={labelledBy}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown size={16} strokeWidth={1.5} color="#6c6c6c" aria-hidden />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className={s.content} position="popper" sideOffset={4}>
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item key={option.value} value={option.value} className={s.item}>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
