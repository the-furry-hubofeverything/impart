import { Stack, Box, Collapse, Card, CardActions, Fade } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { TaggableGrid } from './TaggableGrid'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { IndexingPanel } from './IndexingPanel'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { ContextMenu } from '@renderer/common/ContextMenu'
import { GridActions } from './GridActions'
import { getTaggableContextMenuOptions } from './taggableContextMenuOptions'
import { SelectionIndicator } from './SelectionIndicator'

export interface TaggableBrowserProps {
  onSettingsPressed?: () => void
  onEditTags?: (file: Impart.Taggable) => void
  onBulkTag?: (files: Impart.Taggable[]) => void
}

export function TaggableBrowser({
  onSettingsPressed,
  onEditTags,
  onBulkTag
}: TaggableBrowserProps) {
  const [isScrolledToTop, setScrolledToTop] = useState(true)

  const { taggables, isIndexing } = useTaggables()
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

  const { selectItem } = useMultiSelection(
    taggables,
    selection,
    setSelection,
    useCallback((a, b) => a.id === b.id, [])
  )

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (isScrolledToTop && e.currentTarget.scrollTop !== 0) {
      setScrolledToTop(false)
    } else if (!isScrolledToTop && e.currentTarget.scrollTop === 0) {
      setScrolledToTop(true)
    }
  }

  const rightClickSelect = useCallback((item: Impart.Taggable) => selectItem(item), [selectItem])

  return (
    <Stack direction="row" gap={1} height="100vh">
      <Stack overflow="auto" position={'relative'} flex={1} pr={1} gap={2} onScroll={handleScroll}>
        <Box position="sticky" top={8} pl={1}>
          <Card
            sx={{
              opacity: isScrolledToTop ? 1 : 0.4,
              transition: '0.2s',
              '&:hover': { opacity: 1 }
            }}
          >
            <CardActions>
              <GridActions />
            </CardActions>
          </Card>
        </Box>
        <ContextMenu
          flex={1}
          options={getTaggableContextMenuOptions(selection, onEditTags, onBulkTag)}
        >
          <TaggableGrid
            taggables={taggables}
            selection={selection}
            onSelect={selectItem}
            onRightClick={rightClickSelect}
          />
        </ContextMenu>
        <Fade in={selection.length > 0}>
          <Box position="fixed" bottom={10} left={10}>
            <SelectionIndicator
              count={selection.length}
              onTag={() =>
                selection.length == 1
                  ? onEditTags && onEditTags(selection[0])
                  : onBulkTag && onBulkTag(selection)
              }
              onClear={() => setSelection([])}
            />
          </Box>
        </Fade>
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
  )
}
