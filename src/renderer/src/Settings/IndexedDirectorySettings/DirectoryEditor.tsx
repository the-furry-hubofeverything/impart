import { Box, Card, CardHeader, IconButton, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import UndoIcon from '@mui/icons-material/Undo'

function isDifferent(first?: Impart.Directory, second?: Impart.Directory) {
  return (first == null) != (second == null)
}

export interface DirectoryEditorProps {
  directoryState?: Impart.Directory
  originalDirectory?: Impart.Directory
  onDelete?: () => void
  onRestore?: () => void
}

export function DirectoryEditor({
  directoryState,
  originalDirectory,
  onDelete,
  onRestore
}: DirectoryEditorProps) {
  if (directoryState == null) {
    if (originalDirectory == null) {
      throw new Error('DirectoryState and OriginalDirectory cannot both be null')
    }

    return (
      <Card sx={{ bgcolor: '#c7e4dd' }}>
        <CardHeader
          disableTypography
          title={
            <Typography color="text.secondary" fontSize={18}>
              {originalDirectory.path}{' '}
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

  return (
    <Card sx={{ bgcolor: '#fff' }}>
      <CardHeader
        title={directoryState.path}
        action={
          <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        }
      />
    </Card>
  )
}
