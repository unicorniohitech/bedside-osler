// ?capture=1 zera os atrasos da API e esconde o que só existe para operar o protótipo.
export const isCapture = () => new URLSearchParams(window.location.search).has('capture')
