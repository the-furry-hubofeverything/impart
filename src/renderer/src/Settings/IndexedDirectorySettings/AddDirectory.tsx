import React, { useState } from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'

export interface AddDirectoryProps {
  directoryState: Impart.Directory[]
  onAdd?: (path: string) => void
}

export function AddDirectory({ directoryState, onAdd }: AddDirectoryProps) {
  const [showConflict, setShowConflict] = useState(false)
  const [loadedPath, setLoadedPath] = useState<string>()
  const [conflictingDirectory, setConflictingDirectory] = useState<Impart.Directory>()

  const addDirectory = async () => {
    const folder = await window.indexApi.selectDirectory()

    if (folder == null) {
      return
    }

    for (const directory of directoryState) {
      if (directory.path === folder || (directory.recursive && folder.startsWith(directory.path))) {
        setConflictingDirectory(directory)
        setLoadedPath(folder)
        setShowConflict(true)
        return
      }
    }

    onAdd && onAdd(folder)
  }

  return (
    <>
      <Button
        startIcon={<CreateNewFolderIcon />}
        variant="outlined"
        size="large"
        onClick={addDirectory}
      >
        Add Directory
      </Button>
      <Dialog open={showConflict} onClose={() => setShowConflict(false)} maxWidth={false}>
        <DialogTitle>Directory Conflict</DialogTitle>
        <DialogContent>
          <Stack direction="row" gap={4}>
            <Box p={10}>[ART]</Box>
            <Stack gap={2} alignItems="flex-start">
              <Typography>The selected directory:</Typography>
              <Box py={0.5} px={1} borderRadius={2} bgcolor="secondary.light">
                <Typography fontWeight={'bold'}>{loadedPath}</Typography>
              </Box>
              {conflictingDirectory?.path === loadedPath && (
                <Typography>Has already been loaded</Typography>
              )}
              {conflictingDirectory?.path !== loadedPath && (
                <Typography>
                  Is a subfolder of a recursive directory that's already been loaded.
                </Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
