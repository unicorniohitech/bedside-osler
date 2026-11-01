import { useSyncExternalStore } from 'react'

type Block = { id?: string; type: string }

function createStore() {
  let ids: ReadonlySet<string> = new Set()
  const listeners = new Set<() => void>()

  return {
    get ids() {
      return ids
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    set(id: string, collapsed: boolean) {
      if (ids.has(id) === collapsed) return
      const next = new Set(ids)
      if (collapsed) next.add(id)
      else next.delete(id)
      ids = next
      listeners.forEach((l) => l())
    },
  }
}

const stores = new WeakMap<object, ReturnType<typeof createStore>>()

export function collapsedSections(editor: object) {
  let store = stores.get(editor)
  if (!store) {
    store = createStore()
    stores.set(editor, store)
  }
  return store
}

export function useSectionCollapsed(editor: object, id: string) {
  const store = collapsedSections(editor)
  return useSyncExternalStore(store.subscribe, () => store.ids.has(id))
}

export function hiddenBlockKeys<T extends Block>(
  blocks: T[],
  isCollapsed: (header: T, index: number) => boolean,
) {
  const hidden: number[] = []
  let collapsed = true
  blocks.forEach((b, i) => {
    if (b.type === 'sectionHeader') collapsed = isCollapsed(b, i)
    else if (collapsed) hidden.push(i)
  })
  return hidden
}

export function sectionHeaderOf<T extends Block>(blocks: T[], id: string) {
  const at = blocks.findIndex((b) => b.id === id)
  for (let i = at - 1; i >= 0; i--) if (blocks[i].type === 'sectionHeader') return blocks[i]
  return undefined
}
