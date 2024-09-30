import { Stack, Typography } from '@mui/material'
import { isTaggableStack } from '@renderer/common/taggable'
import { useImpartIpcCall, useImpartIpcData } from '@renderer/common/useImpartIpc'
import React from 'react'

export interface HiddenItemsProps {}

export function HiddenItems({}: HiddenItemsProps) {
  const { data: hiddenTaggables } = useImpartIpcData(
    () => window.taggableApi.getTaggables({ onlyHidden: true, order: 'alpha' }),
    []
  )

  return (
    <Stack>
      {hiddenTaggables?.map((t) => (
        <Typography key={t.id}>{isTaggableStack(t) ? t.name : t.fileIndex.fileName}</Typography>
      ))}
    </Stack>
  )
}
