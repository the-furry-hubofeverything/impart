import { useCallback, useId, useState } from 'react'
import { useActiveContextMenu } from './ActiveContextMenuProvider'

export function useContextMenu() {
  const id = useId()
  const { activeId, setActiveId } = useActiveContextMenu()

  const [anchorPosition, setAnchorPosition] = useState<{
    left: number
    top: number
  }>()

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setAnchorPosition({
      left: event.clientX + 2,
      top: event.clientY - 6
    })
    setActiveId(id)
  }, [])

  const closeMenu = useCallback(() => {
    setAnchorPosition(undefined)
    setActiveId(undefined)
  }, [])

  return {
    anchorPosition,
    open: activeId == id && anchorPosition != null,
    handleContextMenu,
    closeMenu
  }
}
