import { Box, CssBaseline, Dialog, DialogContent, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { useEffect, useState } from 'react'
import { useTaggables } from './EntityProviders/TaggableProvider/TaggableProvider'
import { FileBrowser } from './TaggableBrowser'
import { IntroSetup } from './IntroSetup'
import { EditTags } from './EditTags'
import { useDirectories } from './EntityProviders/DirectoryProvider'
import { Settings } from './Settings'
import { BulkTag } from './BulkTag'

type ImpartModal = 'editTags' | 'bulkTag' | 'settings'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const { data: directories, startingUp, reload: reloadDirectories } = useDirectories()

  const hasDirectories = directories && directories.length !== 0

  const [currentModal, setCurrentModal] = useState<ImpartModal | null>(null)
  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { fetchTaggables } = useTaggables()

  useEffect(() => {
    window.indexApi.indexAll()
  }, [])

  useEffect(() => {
    fetchTaggables()
  }, [fetchTaggables])

  const renderContent = () => {
    switch (currentModal) {
      case 'settings':
        return <Settings onClose={() => setCurrentModal(null)} />
      case 'editTags':
        if (selection.length !== 1) {
          throw new Error('Tried to edit tags while zero or multiple images were selected')
        }

        return <EditTags item={selection[0]} onFinish={() => setCurrentModal(null)} />
      case 'bulkTag':
        return <BulkTag items={selection} onFinish={() => setCurrentModal(null)} />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!startingUp && !hasDirectories && <IntroSetup reload={reloadDirectories} />}
      {!startingUp && hasDirectories && (
        <Box>
          <FileBrowser
            onSettingsPressed={() => setCurrentModal('settings')}
            onEditTags={(file) => {
              setSelection([file])
              setCurrentModal('editTags')
            }}
            onBulkTag={(files) => {
              setSelection(files)
              setCurrentModal('bulkTag')
            }}
          />
          <Dialog open={currentModal != null} onClose={() => setCurrentModal(null)} fullScreen>
            <DialogContent sx={(theme) => ({ bgcolor: theme.palette.background.default })}>
              {renderContent()}
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </ThemeProvider>
  )
}
