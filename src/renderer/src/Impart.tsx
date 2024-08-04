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
import { IndexedDirectoriesSettings } from './IndexedDirectoriesSettings'
import { useEffect, useState } from 'react'
import { useFiles } from './FileProvider/FileProvider'
import { FileBrowser } from './FileBrowser'
import { IntroSetup } from './IntroSetup'
import { EditTags } from './EditTags'

type ImpartState = 'files' | 'editTags'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const {
    data: directories,
    isLoading,
    executeRequest: reloadDirectories
  } = useAsyncData(() => window.fileApi.getDirectories(), [])

  const hasDirectories = directories && directories.length !== 0

  const [showModal, setShowModal] = useState<'directories' | null>(null)
  const [state, setState] = useState<ImpartState>('files')

  const [selection, setSelection] = useState<Impart.TaggableImage[]>([])

  const { fetchAllFiles, ready } = useFiles()

  useEffect(() => {
    if (ready) {
      fetchAllFiles()
    }
  }, [fetchAllFiles, ready])

  const renderContent = () => {
    switch (state) {
      case 'files':
        return (
          <FileBrowser
            onSettingsPressed={(b) => setShowModal(b)}
            onEditTags={(file) => {
              setSelection([file])
              setState('editTags')
            }}
          />
        )
      case 'editTags':
        if (selection.length !== 1) {
          throw new Error('Tried to edit tags while zero or multiple images were selected')
        }

        return <EditTags item={selection[0]} />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoading && !hasDirectories && <IntroSetup reload={reloadDirectories} />}
      {!isLoading && hasDirectories && renderContent()}
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
