import { Box, CssBaseline, Dialog, DialogContent, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { useEffect, useState } from 'react'
import { useTaggables } from './EntityProviders/TaggableProvider'
import { TaggableBrowser } from './TaggableBrowser'
import { IntroSetup } from './IntroSetup'
import { useDirectories } from './EntityProviders/DirectoryProvider'
import { Settings } from './Settings'
import { BulkTag } from './BulkTag'
import { CreateStack } from './CreateStack'
import { useLocalStorage } from './Common/Hooks/useLocalStorage'
import { BetaWarning } from './BetaWarning/BetaWarning'
import { DndContext, DragOverlay, MouseSensor, useSensor } from '@dnd-kit/core'
import { TaggableDisplay } from './Common/Components/TaggableDisplay'
import { ImpartDragAndDropProvider } from './Common/Components/DragAndDrop/ImpartDragAndDropProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { TaggableSelectionProvider } from './TaggableSelectionProvider'
import { AssociateWithSource } from './AssociateWithSource'
import { isTaggableImage } from './Common/taggable'

const SHOW_BETA_WARNING_KEY = 'showBetaWarning'

type ImpartModal = 'bulkTag' | 'settings' | 'createStack' | 'associateSource'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const { data: directories, startingUp, reload: reloadDirectories } = useDirectories()

  const hasDirectories = directories && directories.length !== 0

  const [currentModal, setCurrentModal] = useState<ImpartModal | null>(null)
  const [selection, setSelection] = useState<Impart.Taggable[]>([])
  const [showBetaWarning, setShowBetaWarning] = useLocalStorage(SHOW_BETA_WARNING_KEY, true)

  useHotkeys('escape', () => setCurrentModal(null))

  const { reload: fetchTaggables } = useTaggables()

  useEffect(() => {
    window.indexApi.indexAll()
  }, [])

  const closeAndRefresh = () => {
    setCurrentModal(null)
    fetchTaggables()
  }

  const renderContent = () => {
    switch (currentModal) {
      case 'settings':
        return <Settings onClose={() => setCurrentModal(null)} />
      case 'bulkTag':
        return <BulkTag items={selection} onFinish={closeAndRefresh} />
      case 'createStack':
        return <CreateStack items={selection} onFinish={closeAndRefresh} />
      case 'associateSource':
        if (!selection.every(isTaggableImage)) {
          throw new Error('Attempted to associate non-image items with source files')
        }

        return <AssociateWithSource items={selection} onFinish={closeAndRefresh} />
    }
  }

  if (startingUp) {
    return null
  }

  if (showBetaWarning) {
    return <BetaWarning onClose={() => setShowBetaWarning(false)} />
  }

  if (!hasDirectories) {
    return <IntroSetup reload={reloadDirectories} />
  }

  return (
    <TaggableSelectionProvider selection={selection} setSelection={setSelection}>
      <ImpartDragAndDropProvider>
        <Box>
          <TaggableBrowser
            onSettingsPressed={() => setCurrentModal('settings')}
            onBulkTag={() => setCurrentModal('bulkTag')}
            onCreateStack={() => setCurrentModal('createStack')}
            onAssociateWithSource={() => setCurrentModal('associateSource')}
          />
          <Dialog open={currentModal != null} onClose={() => setCurrentModal(null)} fullScreen>
            <DialogContent sx={(theme) => ({ bgcolor: theme.palette.background.default })}>
              {renderContent()}
            </DialogContent>
          </Dialog>
        </Box>
      </ImpartDragAndDropProvider>
    </TaggableSelectionProvider>
  )
}
