import { ToggleButtonGroup, Tooltip, ToggleButton, Typography, Stack } from '@mui/material'
import React from 'react'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import ClockIcon from '@mui/icons-material/AccessTime'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface GridActionsProps {}

export function GridActions({}: GridActionsProps) {
  const {
    fetchOptions: { order },
    setFetchOptions
  } = useTaggables()

  return (
    <Stack direction="row" alignItems={'center'} gap={1}>
      <Typography>Order:</Typography>
      <ToggleButtonGroup
        value={order}
        size="small"
        exclusive
        onChange={(e, value) => {
          if (value) {
            setFetchOptions({ order: value })
          }
        }}
      >
        <Tooltip title="Sort Alphabetically">
          <ToggleButton value={'alpha'}>
            <SortByAlphaIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Sort by Last Modified">
          <ToggleButton value={'date'}>
            <ClockIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Stack>
  )
}
