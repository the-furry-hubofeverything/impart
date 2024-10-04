import {
  Box,
  BoxProps,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import React from 'react'
import { useContextMenu } from './useContextMenu'

export interface ContextMenuOption {
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  hide?: boolean
  danger?: boolean
  onClick?: () => void
}

export interface ContextMenuProps extends Omit<BoxProps, 'children'> {
  options?: (ContextMenuOption | 'divider')[]
  disabled?: boolean
  render: (open: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) => React.ReactNode
}

export function ContextMenu({ options, render, disabled, ...boxProps }: ContextMenuProps) {
  const { anchorPosition, closeMenu, handleContextMenu, open } = useContextMenu()

  return (
    <>
      <Box width="100%" height="100%" {...boxProps}>
        {render((e) => {
          if (!disabled) {
            handleContextMenu(e)
          }
        })}
      </Box>
      <Menu
        open={open}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        sx={{
          '& .MuiPaper-root': { minWidth: 200 },
          '& .MuiMenuItem-root+.MuiDivider-root': { marginY: 0.5 }
        }}
      >
        {options
          ?.filter((o) => o === 'divider' || !o.hide)
          .map((o, index) =>
            o === 'divider' ? (
              <Divider key={index} sx={{ margin: 0 }} />
            ) : (
              <MenuItem
                key={index}
                onClick={(e) => {
                  o.onClick && o.onClick()
                  closeMenu()
                  e.stopPropagation()
                }}
                disabled={o.disabled}
              >
                {o.icon && (
                  <ListItemIcon sx={{ color: o.danger ? 'error.main' : undefined }}>
                    {o.icon}
                  </ListItemIcon>
                )}
                <ListItemText inset={!o.icon} sx={{ color: o.danger ? 'error.dark' : undefined }}>
                  {o.label}
                </ListItemText>
                {o.shortcut && (
                  <Typography
                    variant="body2"
                    sx={{ color: o.danger ? 'error.light' : 'text.secondary' }}
                  >
                    {o.shortcut}
                  </Typography>
                )}
              </MenuItem>
            )
          )}
      </Menu>
    </>
  )
}
