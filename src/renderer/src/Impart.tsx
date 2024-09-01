import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { useEffect, useState } from 'react'
import { useTaggables } from './EntityProviders/TaggableProvider/TaggableProvider'
import { FileBrowser } from './TaggableBrowser'
import { IntroSetup } from './IntroSetup'
import { EditTags } from './EditTags'
import { useDirectories } from './EntityProviders/DirectoryProvider'
import { Settings } from './Settings'

type ImpartState = 'files' | 'editTags'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const { data: directories, startingUp, executeRequest: reloadDirectories } = useDirectories()

  const hasDirectories = directories && directories.length !== 0

  const [state, setState] = useState<ImpartState>('files')
  const [showSettings, setShowSettings] = useState(false)

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { startNewFetch } = useTaggables()

  useEffect(() => {
    startNewFetch()
  }, [startNewFetch])

  const renderContent = () => {
    if (showSettings) {
      return <Settings onClose={() => setShowSettings(false)} />
    }

    switch (state) {
      case 'files':
        return (
          <FileBrowser
            onSettingsPressed={() => setShowSettings(true)}
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
    </ThemeProvider>
  )
}
