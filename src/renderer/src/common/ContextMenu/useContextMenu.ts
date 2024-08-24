import { useCallback, useState } from 'react'

export function useContextMenu() {
  const [anchorPosition, setAnchorPosition] = useState<{
    left: number
    top: number
  }>()

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setAnchorPosition(
      anchorPosition == null
        ? {
            left: event.clientX + 2,
            top: event.clientY - 6
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          undefined
    )
  }, [])

  const closeMenu = useCallback(() => {
    setAnchorPosition(undefined)
  }, [])

  return {
    anchorPosition,
    open: anchorPosition != null,
    handleContextMenu,
    closeMenu
  }
}
