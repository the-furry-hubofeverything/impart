import { Box, Stack, Typography, Button, Grid2 } from '@mui/material'
import React from 'react'
import { Tag } from '../Tag/Tag'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOffRounded'

export interface TagSelectionProps {
  selection?: Impart.Tag[]
  onClick?: (tag: Impart.Tag) => void
  onClear?: () => void
}

export function TagSelection({ selection, onClear, onClick }: TagSelectionProps) {
  return (
    <Box pt={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Selected Tags</Typography>
        <Button startIcon={<FilterAltOffIcon />} size="small" onClick={onClear}>
          Clear all
        </Button>
      </Stack>
      <Grid2 container spacing={2} pt={1}>
        {selection?.map((t) => (
          <Grid2 key={t.id}>
            <Tag tag={t} onSelect={() => onClick && onClick(t)} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  )
}
