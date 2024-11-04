import { Popper, PopperProps } from '@mui/material'

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
