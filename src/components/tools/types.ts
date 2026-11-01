import type { Evolution, Note } from '@/types'
import type { EditorApi } from '../editor/NoteEditor'

export interface ToolProps {
  evolution: Evolution
  note: Note | null
  editor: EditorApi | null
  params: URLSearchParams
  cursorSection: string | null
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onClose: () => void
}
