export type NoteAnchor = { field: string } | { text: string }

const HIGHLIGHT = 'note-highlight'
// O lib.dom do TypeScript ainda não declara o HighlightRegistry como Map.
const registry = () =>
  'highlights' in CSS ? (CSS.highlights as unknown as Map<string, Highlight>) : null
const noteRoot = () => document.querySelector('[data-note-root]')

function findText(root: Element, text: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    const at = node.textContent?.indexOf(text) ?? -1
    if (at < 0) continue
    const range = document.createRange()
    range.setStart(node, at)
    range.setEnd(node, at + text.length)
    return range
  }
  return null
}

const findField = (root: Element, field: string) => root.querySelector(`[data-field="${field}"]`)

export function anchorExists(anchor: NoteAnchor) {
  const root = noteRoot()
  if (!root) return false
  return Boolean('field' in anchor ? findField(root, anchor.field) : findText(root, anchor.text))
}

export function clearHighlights() {
  document.querySelectorAll(`.${HIGHLIGHT}`).forEach((el) => el.classList.remove(HIGHLIGHT))
  registry()?.delete(HIGHLIGHT)
}

// Marca os trechos sem tocar no documento da nota, para não disparar salvamento.
export function highlightAnchors(anchors: NoteAnchor[]) {
  clearHighlights()
  const root = noteRoot()
  if (!root) return
  const ranges: Range[] = []
  for (const anchor of anchors) {
    if ('field' in anchor) findField(root, anchor.field)?.classList.add(HIGHLIGHT)
    else {
      const range = findText(root, anchor.text)
      if (range) ranges.push(range)
    }
  }
  if (ranges.length) registry()?.set(HIGHLIGHT, new Highlight(...ranges))
}

export function scrollToAnchor(anchor: NoteAnchor) {
  const root = noteRoot()
  if (!root) return
  const target =
    'field' in anchor ? findField(root, anchor.field) : findText(root, anchor.text)?.startContainer.parentElement
  target?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}
