import { useEffect, useState } from 'react'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

// Abaixo de 1200 px o painel de ferramentas recolhe para a coluna de ícones.
export const useIsNarrow = () => useMediaQuery('(max-width: 1199px)')
