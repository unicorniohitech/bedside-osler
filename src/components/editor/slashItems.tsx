import type { ReactElement } from 'react'
import {
  Activity,
  BookOpen,
  Calculator,
  Code2,
  FileText,
  FlaskConical,
  Hash,
  Heading1,
  Heading4,
  Heading5,
  Heading6,
  Image,
  List,
  ListOrdered,
  Mic,
  Minus,
  Pilcrow,
  Quote,
  Smile,
  Table,
} from 'lucide-react'
import { SuggestionMenu } from '@blocknote/core/extensions'
import type { BedsideEditor } from '../blocks/schema'
import type { ToolId } from '../tools/registry'

export interface SlashItem {
  title: string
  group: string
  icon: ReactElement
  shortcut?: string
  bedside?: boolean
  aliases?: string[]
  onItemClick: () => void
}

type NewBlock = Parameters<BedsideEditor['insertBlocks']>[0][number]

const ICON = { size: 16, strokeWidth: 1.5 }

export function buildSlashItems(editor: BedsideEditor, openTool: (t: ToolId) => void): SlashItem[] {
  const put = (block: NewBlock) => {
    const current = editor.getTextCursorPosition().block
    const empty = Array.isArray(current.content) && current.content.length === 0
    if (empty) editor.replaceBlocks([current], [block])
    else editor.insertBlocks([block], current, 'after')
  }
  const turn = (block: NewBlock) => {
    const current = editor.getTextCursorPosition().block
    editor.updateBlock(current, block)
  }
  const heading = (title: string, level: number, icon: ReactElement, shortcut: string): SlashItem => ({
    title,
    group: 'Títulos',
    icon,
    shortcut,
    onItemClick: () => turn({ type: 'heading', props: { level: level as 1 } }),
  })

  return [
    {
      title: 'Texto',
      group: 'Texto',
      icon: <Pilcrow {...ICON} />,
      shortcut: 'Ctrl+Alt+0',
      onItemClick: () => turn({ type: 'paragraph' }),
    },
    {
      title: 'Texto puro',
      group: 'Texto',
      icon: <Code2 {...ICON} />,
      shortcut: 'Ctrl+Alt+C',
      onItemClick: () => turn({ type: 'codeBlock' }),
    },
    {
      title: 'Citação',
      group: 'Texto',
      icon: <Quote {...ICON} />,
      shortcut: 'Ctrl+Alt+Q',
      onItemClick: () => turn({ type: 'quote' }),
    },
    heading('Título', 1, <Heading1 {...ICON} />, 'Ctrl+Alt+1'),
    heading('Título 4', 4, <Heading4 {...ICON} />, 'Ctrl+Alt+4'),
    heading('Título 5', 5, <Heading5 {...ICON} />, 'Ctrl+Alt+5'),
    heading('Título 6', 6, <Heading6 {...ICON} />, 'Ctrl+Alt+6'),
    {
      title: 'Lista',
      group: 'Listas',
      icon: <List {...ICON} />,
      shortcut: 'Ctrl+Shift+8',
      onItemClick: () => turn({ type: 'bulletListItem' }),
    },
    {
      title: 'Lista numerada',
      group: 'Listas',
      icon: <ListOrdered {...ICON} />,
      shortcut: 'Ctrl+Shift+7',
      onItemClick: () => turn({ type: 'numberedListItem' }),
    },
    {
      title: 'Tabela',
      group: 'Outros',
      icon: <Table {...ICON} />,
      onItemClick: () =>
        put({
          type: 'table',
          content: { type: 'tableContent', rows: [{ cells: ['', '', ''] }, { cells: ['', '', ''] }] },
        }),
    },
    {
      title: 'Imagem',
      group: 'Outros',
      icon: <Image {...ICON} />,
      onItemClick: () => put({ type: 'image' }),
    },
    {
      title: 'Divisor',
      group: 'Outros',
      icon: <Minus {...ICON} />,
      onItemClick: () => put({ type: 'divider' }),
    },
    {
      title: 'Emoji',
      group: 'Outros',
      icon: <Smile {...ICON} />,
      onItemClick: () => editor.getExtension(SuggestionMenu)?.openSuggestionMenu(':'),
    },
    {
      title: 'Inserir CID-10',
      group: 'Bedside',
      bedside: true,
      icon: <BookOpen {...ICON} />,
      onItemClick: () => openTool('cid'),
    },
    {
      title: 'Inserir resultado de calculadora',
      group: 'Bedside',
      bedside: true,
      icon: <Calculator {...ICON} />,
      onItemClick: () => openTool('calc'),
    },
    {
      title: 'Aplicar template',
      group: 'Bedside',
      bedside: true,
      icon: <FileText {...ICON} />,
      onItemClick: () => openTool('templates'),
    },
    {
      title: 'Fluxograma de laboratório',
      group: 'Bedside',
      bedside: true,
      icon: <FlaskConical {...ICON} />,
      onItemClick: () => openTool('flowchart'),
    },
    {
      title: 'Sinais vitais',
      group: 'Bedside',
      bedside: true,
      icon: <Activity {...ICON} />,
      onItemClick: () => put({ type: 'vitals' }),
    },
    {
      title: 'Ditar trecho',
      group: 'Bedside',
      bedside: true,
      icon: <Mic {...ICON} />,
      onItemClick: () => put({ type: 'dictation' }),
    },
    {
      title: 'Nova seção',
      group: 'Bedside',
      bedside: true,
      icon: <Hash {...ICON} />,
      onItemClick: () => put({ type: 'sectionHeader', props: { title: 'Nova seção' } }),
    },
  ]
}
