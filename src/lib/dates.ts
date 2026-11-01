const parts = (iso: string) => {
  const f = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso))
  const get = (t: string) => f.find((p) => p.type === t)?.value ?? ''
  return { date: `${get('day')}/${get('month')}`, time: `${get('hour')}:${get('minute')}` }
}

export const formatDateTime = (iso: string) => {
  const { date, time } = parts(iso)
  return `${date}, ${time}`
}

export const formatDayAtTime = (iso: string) => {
  const { date, time } = parts(iso)
  return `${date} às ${time}`
}

export const formatDay = (iso: string) => parts(iso).date

export const formatTime = (iso: string) => parts(iso).time

// Dia no fuso de São Paulo: uma nota das 22h em UTC-3 já é 01h do dia seguinte em UTC.
export const dayKey = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date(iso))

export const formatLongDate = (iso: string) => {
  const text = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso))
  return text.charAt(0).toUpperCase() + text.slice(1)
}
