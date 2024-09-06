import { Paper, Stack, Typography, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'

export interface SelectionIndicatorProps {
  count?: number
  onClear?: () => void
}

export function SelectionIndicator({ count, onClear }: SelectionIndicatorProps) {
  const [displayCount, setDisplayCount] = useState(count)

  useEffect(() => {
    if (count != 0) {
      setDisplayCount(count)
    }
  }, [count])

  return (
    <Paper
      elevation={8}
      sx={{
        opacity: 0.9,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
      }}
    >
      <Stack direction="row" py={0.5} pl={1} alignItems="center">
        <Typography color="primary.contrastText" variant="body2">
          {displayCount} item{displayCount != 1 ? 's' : ''} selected
        </Typography>
        <IconButton size="small" color="error" onClick={onClear}>
          <CancelIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}
