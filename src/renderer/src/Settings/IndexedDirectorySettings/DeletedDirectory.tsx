import { Card, CardHeader, Typography, IconButton } from '@mui/material'
import React from 'react'
import UndoIcon from '@mui/icons-material/UndoRounded'

export interface DeletedDirectoryProps {
  directory?: Impart.Directory
  onRestore?: () => void
}

export function DeletedDirectory({ directory, onRestore }: DeletedDirectoryProps) {
  if (directory == null) {
    throw new Error('DirectoryState and OriginalDirectory cannot both be null')
  }

  return (
    <Card sx={{ bgcolor: '#c7e4dd' }}>
      <CardHeader
        disableTypography
        title={
          <Typography color="text.secondary" fontSize={18}>
            {directory.path}{' '}
            <Typography component="span" variant="caption">
              (DELETED)
            </Typography>
          </Typography>
        }
        action={
          <IconButton onClick={onRestore}>
            <UndoIcon />
          </IconButton>
        }
        sx={{ paddingX: 2, paddingY: 1 }}
      />
    </Card>
  )
}
