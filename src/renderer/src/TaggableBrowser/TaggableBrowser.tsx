import { Stack, Box, Collapse, Card, CardContent } from '@mui/material'
import { SettingsPanel } from './SettingsPanel'
import { TaskStatus } from '../Common/Components/TaskStatus'
import { TaggableGridEvents } from './BrowserPanel/useTaggableContextMenuOptions'
import { useShowIndexingPanel } from './useShowIndexingPanel'
import { BrowserPanel } from './BrowserPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TagSelector } from '@renderer/Common/Components/TagSelector'
import { useState, useEffect, useCallback } from 'react'
import { EditTaggableProvider } from './EditTaggableProvider'
import { useHotkeys } from 'react-hotkeys-hook'

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

  return (
    <Stack direction="row" gap={1} height="100vh">
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
        <BrowserPanel
          {...gridEvents}
          onEditTags={(t) => {
            setEditTarget(t)
            setEditTagSelection(t.tags)
          }}
          onRenameStack={setRenameTarget}
        />
        <Box minWidth={360} flex={0.25} py={1} pr={1}>
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
      </EditTaggableProvider>
    </Stack>
  )
}
