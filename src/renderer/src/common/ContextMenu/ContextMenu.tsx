import { Box, BoxProps, Menu } from '@mui/material'
import React from 'react'
import { useContextMenu } from './useContextMenu'

export interface ContextMenuProps extends BoxProps {
  options?: (close: () => void) => React.ReactNode[]
}

export function ContextMenu({ options, children, ...boxProps }: ContextMenuProps) {
  const { anchorPosition, closeMenu, handleContextMenu, open } = useContextMenu()

  return (
    <>
      <Box {...boxProps} onContextMenu={handleContextMenu}>
        {children}
      </Box>
      <Menu
        open={open}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
      >
        {options && options(closeMenu)}
      </Menu>
    </>
  )
}
