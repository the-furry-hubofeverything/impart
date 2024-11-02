import { Stack, Box, Collapse, Card, CardContent, useMediaQuery, useTheme } from '@mui/material'
import { SettingsPanel } from './SettingsPanel'
import { TaskStatus } from '../Common/Components/TaskStatus'
import { TaggableGridEvents } from './BrowserPanel/useTaggableContextMenuOptions'
import { useShowIndexingPanel } from './useShowIndexingPanel'
import { BrowserPanel } from './BrowserPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TagSelector } from '@renderer/Common/Components/TagSelector'
import { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { EditTaggableProvider } from './EditTaggableProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export interface TaggableBrowserProps extends Omit<TaggableGridEvents, 'onEditTags'> {
  onSettingsPressed?: () => void
}

export function TaggableBrowser({ onSettingsPressed, ...gridEvents }: TaggableBrowserProps) {
  const showIndexingPanel = useShowIndexingPanel()
  const { reload: fetchTaggables } = useTaggables()

  const [editTarget, setEditTarget] = useState<Impart.Taggable>()
  const [renameTarget, setRenameTarget] = useState<Impart.TaggableStack>()
  const [editTagSelection, setEditTagSelection] = useState<Impart.Tag[]>([])

  useHotkeys('escape', () => {
    if (editTarget || renameTarget) {
      setEditTarget(undefined)
      setRenameTarget(undefined)
      setEditTagSelection([])
    }
  })

  const [fetchByTagSelection, setFetchByTagSelection] = useState<Impart.Tag[]>([])
  const { setFetchOptions } = useTaggables()

  useEffect(() => {
    setFetchOptions({ tagIds: fetchByTagSelection.map((t) => t.id) })
  }, [fetchByTagSelection])

  const theme = useTheme()
  const xl = useMediaQuery(theme.breakpoints.up('xl'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <EditTaggableProvider
      editTarget={editTarget}
      renameTarget={renameTarget}
      tags={editTagSelection}
      onRemoveTag={(t) => {
        const copy = editTagSelection.slice()
        const index = copy.findIndex((c) => c.id === t.id)

        if (index != -1) {
          copy.splice(index, 1)
          setEditTagSelection(copy)
        }
      }}
      onFinish={() => {
        fetchTaggables()
        setEditTarget(undefined)
        setRenameTarget(undefined)
      }}
    >
      <Box height="100vh">
        <PanelGroup autoSaveId="taggableBrowser" direction="horizontal">
          <Panel>
            <BrowserPanel
              {...gridEvents}
              onEditTags={(t) => {
                setEditTarget(t)
                setEditTagSelection(t.tags)
              }}
              onRenameStack={setRenameTarget}
            />
          </Panel>

          <PanelResizeHandle />
          <Panel defaultSize={25} minSize={xl ? 12 : lg ? 15 : 20}>
            <Box py={1} pr={1} height="100%">
              <Stack width="100%" height="100%">
                <Card sx={{ flex: 1, overflowY: 'auto' }}>
                  <CardContent sx={{ height: '100%' }}>
                    <TagSelector
                      selection={editTarget ? editTagSelection : fetchByTagSelection}
                      onChange={editTarget ? setEditTagSelection : setFetchByTagSelection}
                    />
                  </CardContent>
                </Card>
                <Collapse in={showIndexingPanel}>
                  <Box pt={2}>
                    <Card>
                      <CardContent>
                        <TaskStatus />
                      </CardContent>
                    </Card>
                  </Box>
                </Collapse>
                <Box pt={2}>
                  <SettingsPanel onClick={() => onSettingsPressed && onSettingsPressed()} />
                </Box>
              </Stack>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>
    </EditTaggableProvider>
  )
}
