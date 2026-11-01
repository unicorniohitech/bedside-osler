import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import '@blocknote/mantine/style.css'
import { pt } from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import { SuggestionMenuController, useCreateBlockNote, type SuggestionMenuProps } from '@blocknote/react'
import { SuggestionMenu, filterSuggestionItems } from '@blocknote/core/extensions'
import { collapsedSections, hiddenBlockKeys, sectionHeaderOf } from '../blocks/collapsedSections'
import { schema, type BedsideEditor } from '../blocks/schema'
import type { NoteBlock } from '@/types'
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
  slash: string | null
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

  const [hiddenCss, setHiddenCss] = useState('')
  const updateHidden = useCallback(() => {
    const blocks = editor.document
    const { ids } = collapsedSections(editor)
    setHiddenCss(
      hiddenBlockKeys(blocks, (b) => ids.has(b.id))
        .map((i) => `.bn-block-outer[data-id="${CSS.escape(blocks[i].id)}"]{display:none}`)
        .join(''),
    )
  }, [editor])
  useEffect(() => {
    updateHidden()
    return collapsedSections(editor).subscribe(updateHidden)
  }, [editor, updateHidden])

  // O cursor nunca fica escondido: ao chegar numa seção recolhida, ela abre.
  const cursorBlock = useRef<string | null>(null)
  const revealCursor = useCallback(() => {
    const { id, type } = editor.getTextCursorPosition().block
    if (id === cursorBlock.current) return
    cursorBlock.current = id
    const header = type === 'sectionHeader' ? undefined : sectionHeaderOf(editor.document, id)
    if (header) collapsedSections(editor).set(header.id, false)
  }, [editor])

  useImperativeHandle(
    ref,
    () => ({
      insert(blocks) {
        const doc = editor.document
        const at =
          editor.getSelection()?.blocks.at(-1) ?? editor.getTextCursorPosition().block ?? doc[doc.length - 1]
        editor.insertBlocks(blocks as Partial, at, 'after')
        cursorBlock.current = null
        revealCursor()
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
    [editor, revealCursor],
  )

  const scrollToEnd = props.slash === 'bedside'
  const Menu = useMemo(
    () =>
      function Menu(p: SuggestionMenuProps<SlashItem>) {
        return <SlashMenu {...p} scrollToEnd={scrollToEnd} />
      },
    [scrollToEnd],
  )

  const items = useMemo(() => buildSlashItems(editor, (t) => onOpenTool.current(t)), [editor])

  // ?slash= abre o menu do / depois do primeiro parágrafo, como nas telas 16-18.
  useEffect(() => {
    if (!props.slash) return
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
  }, [editor, props.slash])

  return (
    <>
      <style>{hiddenCss}</style>
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
        onChange={() => {
          updateHidden()
          onChange.current(editor.document as unknown as NoteBlock[])
        }}
        onSelectionChange={revealCursor}
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
    </>
  )
})
