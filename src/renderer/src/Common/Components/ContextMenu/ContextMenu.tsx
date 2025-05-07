import {
  Box,
  BoxProps,
  Checkbox,
  ClickAwayListener,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  PopoverVirtualElement,
  Typography
} from '@mui/material'
import React, { useId, useState } from 'react'
import { useContextMenu } from './useContextMenu'
import { BetterPopper } from '../BetterPopper'
import { v4 } from 'uuid'
import { useHotkeys } from 'react-hotkeys-hook'
import CheckedIcon from '@mui/icons-material/CheckBox'
import UncheckedIcon from '@mui/icons-material/CheckBoxOutlineBlank'

export interface ContextMenuOption {
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  hide?: boolean
  danger?: boolean
  onClick?: () => void
  bold?: boolean
  isChecked?: boolean
}

export interface ContextMenuRenderProps {
  isOpen: boolean
  open: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  close: () => void
}

export interface ContextMenuProps extends Omit<BoxProps, 'children'> {
  options?: (ContextMenuOption | 'divider')[]
  disabled?: boolean
  render: (props: ContextMenuRenderProps) => React.ReactNode
}

export function ContextMenu({ options, render, disabled, ...boxProps }: ContextMenuProps) {
  const { anchorPosition, closeMenu, handleContextMenu, open } = useContextMenu()

  const { left = 0, top = 0 } = { ...anchorPosition }

  useHotkeys('escape', closeMenu)

  return (
    <>
      <Box width="100%" height="100%" {...boxProps}>
        {render({
          isOpen: open,
          open: (e) => {
            if (!disabled) {
              handleContextMenu(e)
            }
          },
          close: closeMenu
        })}
      </Box>
      <BetterPopper
        placement="bottom-start"
        open={open}
        anchorEl={() =>
          ({
            getBoundingClientRect: () => ({
              width: 0,
              height: 0,
              top: top,
              right: left,
              bottom: top,
              left: left,
              x: left,
              y: top,
              toJSON: () => ({})
            }),
            nodeType: 1
          }) satisfies PopoverVirtualElement
        }
      >
        <ClickAwayListener onClickAway={() => closeMenu()}>
          <Paper>
            <MenuList
              sx={{
                '& .MuiPaper-root': { minWidth: 200 },
                '& .MuiMenuItem-root+.MuiDivider-root': { marginY: 0.5 }
              }}
              dense
            >
              {options
                ?.filter((o) => o === 'divider' || !o.hide)
                //Filter out all sequential dividers
                .filter((o, index, all) => o !== 'divider' || all[index + 1] !== 'divider')
                .map((o, index, list) =>
                  o === 'divider' ? (
                    index !== 0 &&
                    index != list.length - 1 && <Divider key={index} sx={{ margin: 0 }} />
                  ) : (
                    <MenuItem
                      key={index}
                      onClick={(e) => {
                        o.onClick && o.onClick()
                        if (o.isChecked === undefined) {
                          closeMenu()
                        }
                        e.stopPropagation()
                      }}
                      disabled={o.disabled}
                    >
                      {(o.icon || o.isChecked !== undefined) && (
                        <ListItemIcon
                          sx={{
                            color: o.danger ? 'error.main' : undefined
                          }}
                        >
                          {o.isChecked !== undefined &&
                            (o.isChecked ? <CheckedIcon /> : <UncheckedIcon />)}
                          {o.isChecked === undefined && o.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset={!o.icon && o.isChecked === undefined}
                        sx={{
                          color: o.danger ? 'error.dark' : undefined
                        }}
                        primary={o.label}
                        slotProps={{ primary: { fontWeight: o.bold ? 'bold' : undefined } }}
                      />

                      {o.shortcut && (
                        <Box pl={2} sx={{ opacity: 0.6 }}>
                          <Typography
                            variant="body2"
                            fontSize={12}
                            sx={{ color: o.danger ? 'error.light' : 'text.secondary' }}
                          >
                            {o.shortcut}
                          </Typography>
                        </Box>
                      )}
                    </MenuItem>
                  )
                )}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </BetterPopper>
    </>
  )
}
