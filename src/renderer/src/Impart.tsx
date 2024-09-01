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
import { useTaggables } from './EntityProviders/TaggableProvider/TaggableProvider'
import { FileBrowser } from './TaggableBrowser'
import { IntroSetup } from './IntroSetup'
import { EditTags } from './EditTags'
import { useDirectories } from './EntityProviders/DirectoryProvider'

type ImpartState = 'files' | 'editTags'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const { data: directories, startingUp, executeRequest: reloadDirectories } = useDirectories()

  const hasDirectories = directories && directories.length !== 0

  const [showModal, setShowModal] = useState<'directories' | null>(null)
  const [state, setState] = useState<ImpartState>('files')

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { fetchAllTaggables, ready } = useTaggables()

  useEffect(() => {
    if (ready) {
      fetchAllTaggables()
    }
  }, [fetchAllTaggables, ready])

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

        return <EditTags item={selection[0]} onFinish={() => setState('files')} />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!startingUp && !hasDirectories && <IntroSetup reload={reloadDirectories} />}
      {!startingUp && hasDirectories && renderContent()}
      <Dialog
        open={showModal === 'directories'}
        onClose={() => setShowModal(null)}
        maxWidth={false}
      >
        <DialogTitle>Watched Folders</DialogTitle>
        <DialogContent>
          <IndexedDirectoriesSettings onChange={() => setShowModal(null)} />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
