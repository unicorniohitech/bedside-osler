import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import '@blocknote/mantine/style.css'
import { pt } from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import { SuggestionMenuController, useCreateBlockNote, type SuggestionMenuProps } from '@blocknote/react'
import { SuggestionMenu, filterSuggestionItems } from '@blocknote/core/extensions'
import { schema, type BedsideEditor } from '../blocks/schema'
import type { NoteBlock } from '../../types'
import type { ToolId } from '../tools/registry'
import { SlashMenu } from './SlashMenu'
import { buildSlashItems, type SlashItem } from './slashItems'
import s from './NoteEditor.module.css'

export interface EditorApi {
  insert: (blocks: NoteBlock[]) => void
  replaceAll: (blocks: NoteBlock[]) => void
  replaceBlock: (match: (b: NoteBlock) => boolean, block: NoteBlock) => boolean
  document: () => NoteBlock[]
}

// As telas não mostram placeholder em linha vazia.
const DICTIONARY = { ...pt, placeholders: { ...pt.placeholders, default: '', emptyDocument: '' } }

type Partial = Parameters<BedsideEditor['insertBlocks']>[0]

interface Props {
  content: NoteBlock[]
  barra: string | null
  onChange: (doc: NoteBlock[]) => void
  onOpenTool: (t: ToolId) => void
}

export const NoteEditor = forwardRef<EditorApi, Props>(function NoteEditor(props, ref) {
  const initial = props.content.length ? props.content : [{ type: 'paragraph' }]
  const editor = useCreateBlockNote({
    schema,
    initialContent: initial as Partial,
    dictionary: DICTIONARY,
  }) as unknown as BedsideEditor
  const onOpenTool = useRef(props.onOpenTool)
  onOpenTool.current = props.onOpenTool
  const onChange = useRef(props.onChange)
  onChange.current = props.onChange

  useImperativeHandle(
    ref,
    () => ({
      insert(blocks) {
        const doc = editor.document
        const at =
          editor.getSelection()?.blocks.at(-1) ?? editor.getTextCursorPosition().block ?? doc[doc.length - 1]
        editor.insertBlocks(blocks as Partial, at, 'after')
      },
      replaceAll(blocks) {
        editor.replaceBlocks(editor.document, blocks as Partial)
      },
      replaceBlock(match, block) {
        const found = editor.document.find((b) => match(b as unknown as NoteBlock))
        if (!found) return false
        editor.replaceBlocks([found], [block] as Partial)
        return true
      },
      document: () => editor.document as unknown as NoteBlock[],
    }),
    [editor],
  )

  const scrollToEnd = props.barra === 'bedside'
  const Menu = useMemo(
    () =>
      function Menu(p: SuggestionMenuProps<SlashItem>) {
        return <SlashMenu {...p} scrollToEnd={scrollToEnd} />
      },
    [scrollToEnd],
  )

  const items = useMemo(() => buildSlashItems(editor, (t) => onOpenTool.current(t)), [editor])

  // ?barra= abre o menu do / depois do primeiro parágrafo, como nas telas 16-18.
  useEffect(() => {
    if (!props.barra) return
    const timer = setTimeout(() => {
      const anchor = editor.document.find((b) => b.type === 'paragraph')
      if (!anchor) return
      const [created] = editor.insertBlocks([{ type: 'paragraph' }], anchor, 'after')
      editor.setTextCursorPosition(created, 'end')
      editor.focus()
      // Passa pelo mesmo caminho da digitação, para o / ficar no texto e abrir o menu.
      document.execCommand('insertText', false, '/')
    }, 30)
    return () => clearTimeout(timer)
  }, [editor, props.barra])

  return (
    <BlockNoteView
      className={s.editor}
      editor={editor as never}
      theme="light"
      slashMenu={false}
      sideMenu={false}
      formattingToolbar={false}
      linkToolbar={false}
      filePanel={false}
      tableHandles={false}
      onChange={() => onChange.current(editor.document as unknown as NoteBlock[])}
    >
      <SuggestionMenuController<(q: string) => Promise<SlashItem[]>>
        triggerCharacter="/"
        getItems={async (q) => filterSuggestionItems(items, q)}
        suggestionMenuComponent={Menu}
        onItemClick={(item) => {
          const menu = editor.getExtension(SuggestionMenu)
          menu?.closeMenu()
          menu?.clearQuery()
          item.onItemClick()
        }}
      />
    </BlockNoteView>
  )
})
