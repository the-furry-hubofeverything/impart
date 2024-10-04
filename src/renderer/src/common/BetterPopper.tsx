import { ClickAwayListener, Popper, PopperProps } from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface BetterPopoverProps extends Omit<PopperProps, 'modifiers' | 'placement'> {}

export function BetterPopover({ ...popperProps }: BetterPopoverProps) {
  return (
    <Popper
      {...popperProps}
      placement="bottom"
      modifiers={[
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: 'document',
            padding: 8
          }
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10]
          }
        }
      ]}
    />
  )
}
