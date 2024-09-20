import { Stack, Box, Collapse, Card, CardActions, Fade } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TaggableGrid } from '../common/TaggableGrid/TaggableGrid'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { IndexingPanel } from './IndexingPanel'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { ContextMenu } from '@renderer/common/ContextMenu'
import { GridActions } from './GridActions'
import { getTaggableContextMenuOptions } from './taggableContextMenuOptions'
import { SelectionIndicator } from './SelectionIndicator'
import { HexColorPicker } from 'react-colorful'
import { GroupedTaggableGrid, buildTaggableGroups } from '@renderer/common/TaggableGrid'
import { useTaskStatus } from '@renderer/TaskStatusProvider'

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
  const { taggables } = useTaggables()
  const { isIndexing } = useTaskStatus()
  const taggableGroups = useMemo(() => buildTaggableGroups(taggables), [taggables])
  const taggableFlatMap = useMemo(
    () => taggableGroups.flatMap((g) => g.taggables),
    [taggableGroups]
  )

  const [showIndexingPanel, setShowIndexingPanel] = useState(false)

  const [groupByDirectory, setGroupByDirectory] = useState(false)

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
    groupByDirectory ? taggableFlatMap : taggables,
    selection,
    setSelection,
    useCallback((a, b) => a.id === b.id, [])
  )

  const rightClickSelect = useCallback((item: Impart.Taggable) => selectItem(item), [selectItem])

  return (
    <Stack direction="row" gap={1} height="100vh">
      <Stack overflow="auto" position={'relative'} flex={1} pr={1} gap={2}>
        <Box position="sticky" top={8} pl={1} zIndex={1}>
          <Card>
            <CardActions>
              <GridActions groupByDirectory={groupByDirectory} onChange={setGroupByDirectory} />
            </CardActions>
          </Card>
        </Box>
        <ContextMenu
          flex={1}
          options={getTaggableContextMenuOptions(selection, onEditTags, onBulkTag)}
        >
          {!groupByDirectory && (
            <TaggableGrid
              taggables={taggables}
              selection={selection}
              onSelect={selectItem}
              onRightClick={rightClickSelect}
            />
          )}
          {groupByDirectory && (
            <GroupedTaggableGrid
              groups={taggableGroups}
              selection={selection}
              onSelect={selectItem}
              onRightClick={rightClickSelect}
            />
          )}
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
