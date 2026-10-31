export const formatInitials = (value: string) =>
  value
    .replace(/[^\p{L}]/gu, '')
    .toUpperCase()
    .split('')
    .map((c) => `${c}.`)
    .join('')
