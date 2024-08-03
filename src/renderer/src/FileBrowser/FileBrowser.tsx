import { Stack, Box, Collapse } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ImageGrid } from './ImageGrid'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { useFiles } from '@renderer/FileProvider'
import { IndexingPanel } from './IndexingPanel'

export interface FileBrowserProps {
  onPress?: (button: 'directories') => void
}

export function FileBrowser({ onPress }: FileBrowserProps) {
  const { fetchAllFiles, ready } = useFiles()
  const { isIndexing } = useFiles()

  useEffect(() => {
    if (ready) {
      fetchAllFiles()
    }
  }, [fetchAllFiles, ready])

  return (
    <Stack direction="row" p={1} gap={1} height="100vh">
      <Stack flex={1} overflow="auto" pr={1} gap={2}>
        <Stack position="sticky" top={4}></Stack>
        <Box flex={1}>
          <ImageGrid />
        </Box>
      </Stack>
      <Box minWidth={300} flex={0.25}>
        <Stack width="100%" height="100%">
          <TaggingPanel />
          <Collapse in={isIndexing}>
            <Box pt={2}>
              <IndexingPanel />
            </Box>
          </Collapse>
          <Box pt={2}>
            <SettingsPanel onClick={(b) => onPress && onPress(b)} />
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
