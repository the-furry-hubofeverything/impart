import { Stack, Typography, Grid2, Button } from '@mui/material'
import React from 'react'
import { Tag } from '../Tag'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

export interface EditTagsProps {
  tags: Impart.Tag[]
  onSave: () => void
  onClose: () => void
}

export function EditTags({ tags, onSave, onClose }: EditTagsProps) {
  return (
    <Stack p={2} gap={2}>
      <Typography textAlign="center" variant="h6">
        Tags
      </Typography>
      {tags.length > 0 && (
        <Grid2 container maxWidth={360} spacing={1} justifyContent={'center'}>
          {tags.map((t) => (
            <Grid2 key={t.id}>
              <Tag tag={t} />
            </Grid2>
          ))}
        </Grid2>
      )}
      {tags.length == 0 && (
        <Typography color="text.secondary" textAlign="center" fontStyle="italic" variant="body2">
          Untagged
        </Typography>
      )}
      <Stack direction="row" justifyContent="center" gap={1}>
        <Button size="small" startIcon={<CloseIcon />} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" size="small" startIcon={<CheckIcon />} onClick={onSave}>
          Save
        </Button>
      </Stack>
    </Stack>
  )
}
