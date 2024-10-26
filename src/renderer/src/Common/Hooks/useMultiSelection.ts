import { useCallback, useEffect, useState } from 'react'

export function useMultiSelection<Item>(
  items: Item[],
  selection: Item[],
  onChange: ((selection: Item[]) => void) | undefined,
  isEqual: (first: Item, second: Item) => boolean,
  options?: {
    toggleMode?: boolean
    selectionActionOnItemChange: 'reset' | 'invalidate' | 'update' | 'nothing'
  }
) {
  const [previousSelection, setPreviousSelection] = useState<Item>()

  useEffect(() => {
    if (
      options?.selectionActionOnItemChange == null ||
      options.selectionActionOnItemChange === 'update'
    ) {
      onChange && onChange(selection.filter((s) => items.some((i) => isEqual(s, i))))
    }

    if (
      options?.selectionActionOnItemChange === 'reset' ||
      (options?.selectionActionOnItemChange === 'invalidate' &&
        selection.some((s) => !items.some((i) => isEqual(s, i))))
    ) {
      onChange && onChange([])
    }
  }, [items, options?.selectionActionOnItemChange])

  const itemIsSelected = useCallback(
    (item: Item) => {
      return selection.some((s) => isEqual(s, item))
    },
    [selection, isEqual]
  )

  const selectItem = useCallback(
    (item: Item, add?: boolean, range?: boolean) => {
      if (options?.toggleMode) {
        if (itemIsSelected(item)) {
          const copy = selection.slice()
          copy.splice(
            copy.findIndex((c) => isEqual(c, item)),
            1
          )

          onChange && onChange(copy)
        } else {
          onChange && onChange(selection.concat([item]))
        }

        return
      }

      if (itemIsSelected(item)) {
        if (add) {
          onChange && onChange(selection.filter((s) => !isEqual(s, item)))
        } else if (!range && selection.length > 1) {
          onChange && onChange([item])
        }

        return
      }

      let selectedItems: Item[] = []

      if (range && previousSelection) {
        const prevIndex = items.findIndex((f) => isEqual(f, previousSelection))
        const nextIndex = items.findIndex((f) => isEqual(f, item))

        selectedItems = items.slice(
          Math.min(prevIndex, nextIndex),
          Math.max(prevIndex, nextIndex) + 1
        )
      } else {
        selectedItems = [item]
      }

      if (add) {
        const notYetSelectedItems = selectedItems.filter(
          (i) => !selection?.some((s) => isEqual(s, i))
        )
        onChange && onChange(selection.concat(notYetSelectedItems))
      } else {
        onChange && onChange(selectedItems)
      }

      setPreviousSelection(item)
    },
    [items, selection, previousSelection, isEqual, options?.toggleMode]
  )

  return { selectItem, itemIsSelected }
}
