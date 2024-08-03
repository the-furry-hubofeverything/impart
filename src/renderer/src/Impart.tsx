import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  ThemeProvider,
  Typography
} from '@mui/material'
import { theme } from './theme'
import { useAsyncData } from './common/useAsyncData'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { IndexedDirectoriesSettings } from './IndexedDirectoriesSettings'
import { useEffect, useState } from 'react'
import { useFiles } from './FileProvider/FileProvider'
import { FileBrowser } from './FileBrowser'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const {
    data: directories,
    isLoading,
    executeRequest: reloadDirectories
  } = useAsyncData(() => window.fileApi.getDirectories(), [])

  const hasDirectories = directories && directories.length !== 0

  const [showModal, setShowModal] = useState<'directories' | null>(null)

  const { fetchAllFiles, ready } = useFiles()

  useEffect(() => {
    if (ready) {
      fetchAllFiles()
    }
  }, [fetchAllFiles, ready])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoading && !hasDirectories && (
        <Stack justifyContent="center" alignItems="center" gap={2} height="100vh">
          <Typography textAlign="center" sx={{ opacity: 0.6 }}>
            Impart hasn't found any files yet! Add a folder to start organizing your gallery
          </Typography>
          <Button
            startIcon={<CreateNewFolderIcon />}
            variant="contained"
            onClick={async () => {
              await window.fileApi.selectAndIndexDirectory()
              reloadDirectories()
            }}
          >
            Add Folder
          </Button>
        </Stack>
      )}
      {!isLoading && hasDirectories && <FileBrowser onPress={(b) => setShowModal(b)} />}
      <Dialog
        open={showModal === 'directories'}
        onClose={() => setShowModal(null)}
        maxWidth={false}
      >
        <DialogTitle>Watched Folders</DialogTitle>
        <DialogContent>
          <IndexedDirectoriesSettings directories={directories} onChange={reloadDirectories} />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
