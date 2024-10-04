import { Stack, Box, Collapse, Card, CardContent } from '@mui/material'
import { SettingsPanel } from './SettingsPanel'
import { TaskStatus } from '../common/TaskStatus'
import { TaggableGridEvents } from './BrowserPanel/taggableContextMenuOptions'
import { useShowIndexingPanel } from './useShowIndexingPanel'
import { BrowserPanel } from './BrowserPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TagSelector } from '@renderer/common/TagSelector'
import { useState, useEffect, useCallback } from 'react'
import { EditTagsProvider } from './EditTagsProvider'

export interface TaggableBrowserProps extends Omit<TaggableGridEvents, 'onEditTags'> {
  onSettingsPressed?: () => void
}

export function TaggableBrowser({ onSettingsPressed, ...gridEvents }: TaggableBrowserProps) {
  const showIndexingPanel = useShowIndexingPanel()
  const { fetchTaggables } = useTaggables()

  const [editTarget, setEditTarget] = useState<Impart.Taggable>()
  const [editTagSelection, setEditTagSelection] = useState<Impart.Tag[]>([])

  const [fetchByTagSelection, setFetchByTagSelection] = useState<Impart.Tag[]>([])
  const { setFetchOptions } = useTaggables()

  useEffect(() => {
    setFetchOptions({ tagIds: fetchByTagSelection.map((t) => t.id) })
  }, [fetchByTagSelection])

  return (
    <Stack direction="row" gap={1} height="100vh">
      <EditTagsProvider
        editTarget={editTarget}
        tags={editTagSelection}
        onFinish={() => {
          fetchTaggables()
          setEditTarget(undefined)
        }}
      >
        <BrowserPanel
          {...gridEvents}
          onEditTags={(t) => {
            setEditTarget(t)
            setEditTagSelection(t.tags)
          }}
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
      </EditTagsProvider>
    </Stack>
  )
}
