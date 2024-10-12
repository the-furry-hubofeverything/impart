import { ClickAwayListener, Popper, PopperProps } from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface BetterPopper extends Omit<PopperProps, 'modifiers'> {}

export function BetterPopper({ ...popperProps }: BetterPopper) {
  return (
    <Popper
      {...popperProps}
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
