import { Paper, Stack, Typography, IconButton, ButtonGroup, Button, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import SellIcon from '@mui/icons-material/Sell'

export interface SelectionIndicatorProps {
  count?: number
  onTag?: () => void
  onClear?: () => void
}

export function SelectionIndicator({ count, onTag, onClear }: SelectionIndicatorProps) {
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
      <Stack direction="row" py={0.5} pl={1} alignItems="center" gap={1}>
        <Typography variant="body2">
          {displayCount} item{displayCount != 1 ? 's' : ''} selected
        </Typography>
        <Tooltip
          title={displayCount == 1 ? 'Edit Tags' : 'Bulk Tag'}
          placement="top"
          onClick={onTag}
        >
          <IconButton>
            {displayCount == 1 && <SellIcon />}
            {displayCount != 1 && <BookmarksIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear Selection" placement="top">
          <IconButton size="small" color="error" onClick={onClear}>
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  )
}
