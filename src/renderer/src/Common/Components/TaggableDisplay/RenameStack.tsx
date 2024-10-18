import { Stack, TextField, Typography } from '@mui/material'
import { useEditTaggable } from '@renderer/TaggableBrowser/EditTaggableProvider'
import React, { useState } from 'react'

export interface RenameStackProps {
  stack: Impart.TaggableStack
}

export function RenameStack({ stack }: RenameStackProps) {
  const [internalName, setInternalName] = useState(stack.name)

  const editState = useEditTaggable()

  const rename = async () => {
    window.stackApi.rename(stack.id, internalName)

    if (editState) {
      editState.close()
    }
  }

  return (
    <Stack p={2} gap={2}>
      <Typography textAlign="center" variant="h6" fontSize={18}>
        Rename Stack
      </Typography>
      <TextField
        label="Name"
        size="small"
        autoFocus
        value={internalName}
        onChange={(e) => setInternalName(e.currentTarget.value)}
        onBlur={rename}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            rename()
          }

          if (e.key === 'Escape' && editState) {
            editState.close()
          }
        }}
      />
    </Stack>
  )
}
