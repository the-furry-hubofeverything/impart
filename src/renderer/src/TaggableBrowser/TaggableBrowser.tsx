import { Stack, Box, Collapse, Card, CardActions } from '@mui/material'
import { useEffect, useState } from 'react'
import { TaggableGrid } from './TaggableGrid'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { IndexingPanel } from './IndexingPanel'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { ContextMenu } from '@renderer/common/ContextMenu'
import { GridActions } from './GridActions'
import { getTaggableContextMenuOptions } from './taggableContextMenuOptions'

export interface TaggableBrowserProps {
  onSettingsPressed?: () => void
  onEditTags?: (file: Impart.Taggable) => void
}

export function TaggableBrowser({ onSettingsPressed, onEditTags }: TaggableBrowserProps) {
  const {
    taggables,
    isIndexing,
    fetchOptions: { order },
    setFetchOptions
  } = useTaggables()
  const [showIndexingPanel, setShowIndexingPanel] = useState(false)

  useEffect(() => {
    if (isIndexing) {
      setShowIndexingPanel(true)
    } else {
      const timer = setTimeout(() => setShowIndexingPanel(false), 3000)

      return () => clearTimeout(timer)
    }
  }, [isIndexing])

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { selectItem, itemIsSelected } = useMultiSelection(
    taggables,
    selection,
    setSelection,
    (a, b) => a.id === b.id
  )

  return (
    <>
      <Stack direction="row" gap={1} height="100vh">
        <Stack overflow="auto" position={'relative'} flex={1} pr={1} gap={2}>
          <Box position="sticky" top={8} pl={1}>
            <Card sx={{ opacity: 0.4, transition: '0.2s', '&:hover': { opacity: 1 } }}>
              <CardActions>
                <GridActions />
              </CardActions>
            </Card>
          </Box>
          <ContextMenu flex={1} options={getTaggableContextMenuOptions(selection, onEditTags)}>
            <TaggableGrid
              taggables={taggables}
              selection={selection}
              onSelect={selectItem}
              onRightClick={(image, e) => {
                if (!itemIsSelected(image)) {
                  selectItem(image)
                }
              }}
            />
          </ContextMenu>
        </Stack>
        <Box minWidth={300} flex={0.25} py={1} pr={1}>
          <Stack width="100%" height="100%">
            <TaggingPanel />
            <Collapse in={showIndexingPanel}>
              <Box pt={2}>
                <IndexingPanel />
              </Box>
            </Collapse>
            <Box pt={2}>
              <SettingsPanel onClick={() => onSettingsPressed && onSettingsPressed()} />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
