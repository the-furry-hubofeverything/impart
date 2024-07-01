import {
  Box,
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
import { FileIndexStatusProvider } from './FileIndexStatusProvider'
import { ImageGrid } from './ImageGrid'
import { TaggingPanel } from './TaggingPanel'
import { SettingsPanel } from './SettingsPanel'
import { useAsyncData } from './common/useAsyncData'
import CreateNewFolderIcon from '@mui/icons-material/Person'
import { IndexedDirectoriesSettings } from './IndexedDirectoriesSettings'
import { useState } from 'react'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const {
    data: directories,
    isLoading,
    executeRequest: reloadDirectories
  } = useAsyncData(() => window.fileApi.getDirectories(), [])

  const hasDirectories = directories && directories.length !== 0

  const [showModal, setShowModal] = useState<'directories' | null>(null)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FileIndexStatusProvider>
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
        {!isLoading && hasDirectories && (
          <Stack direction="row" p={2} gap={1} height="100vh">
            <Stack flex={1} overflow="auto" pr={1} gap={2}>
              <Stack position="sticky" top={4}>
                <SettingsPanel onClick={(b) => setShowModal(b)} />
              </Stack>
              <Box flex={1}>
                <ImageGrid />
              </Box>
            </Stack>
            <Box width={300}>
              <TaggingPanel />
            </Box>
          </Stack>
        )}
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
      </FileIndexStatusProvider>
    </ThemeProvider>
  )
}
