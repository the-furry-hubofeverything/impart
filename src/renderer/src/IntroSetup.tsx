import { Stack, Typography, Button } from '@mui/material'
import React from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'

export interface IntroSetupProps {
  reload: () => void
}

export function IntroSetup({ reload }: IntroSetupProps) {
  return (
    <Stack justifyContent="center" alignItems="center" gap={2} height="100vh">
      <Typography textAlign="center" sx={{ opacity: 0.6 }}>
        Impart hasn't found any files yet! Add a folder to start organizing your gallery
      </Typography>
      <Button
        startIcon={<CreateNewFolderIcon />}
        variant="contained"
        onClick={async () => {
          await window.fileApi.selectAndIndexDirectory()
          reload()
        }}
      >
        Add Folder
      </Button>
    </Stack>
  )
}
