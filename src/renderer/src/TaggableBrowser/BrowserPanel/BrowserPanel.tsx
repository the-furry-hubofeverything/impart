import { Stack, Box, Card, CardActions, Fade } from '@mui/material'
import { ContextMenu } from '@renderer/common/ContextMenu'
import {
  VirtualTaggableGrid,
  GroupedTaggableGrid,
  buildTaggableGroups
} from '@renderer/common/TaggableGrid'
import React, { useCallback, useMemo, useState } from 'react'
import { GridActions } from './GridActions'
import { SelectionIndicator } from './SelectionIndicator'
import { TaggableGridEvents, getTaggableContextMenuOptions } from './taggableContextMenuOptions'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { isTaggableStack } from '@renderer/common/taggable'

export interface BrowserPanelProps extends TaggableGridEvents {}

export function BrowserPanel({ ...gridEvents }: BrowserPanelProps) {
  const { onBulkTag, onCreateStack, onEditTags } = gridEvents
  const { taggables, setFetchOptions } = useTaggables()
  const taggableGroups = useMemo(() => buildTaggableGroups(taggables), [taggables])
  const taggableFlatMap = useMemo(
    () => taggableGroups.flatMap((g) => g.taggables),
    [taggableGroups]
  )

  const groupLimitExceeded = taggables.length > 1000
  const [groupByDirectory, setGroupByDirectory] = useState(false)

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { selectItem } = useMultiSelection(
    groupByDirectory ? taggableFlatMap : taggables,
    selection,
    setSelection,
    useCallback((a, b) => a.id === b.id, [])
  )
  const rightClickSelect = useCallback((item: Impart.Taggable) => selectItem(item), [selectItem])

  return (
    <Stack overflow="auto" position={'relative'} flex={1} pr={1} gap={2}>
      <Box position="sticky" top={8} pl={1} zIndex={1}>
        <Card>
          <CardActions>
            <GridActions
              groupByDirectory={groupByDirectory}
              disableGrouping={groupLimitExceeded}
              onChange={setGroupByDirectory}
            />
          </CardActions>
        </Card>
      </Box>
      <ContextMenu
        flex={1}
        options={getTaggableContextMenuOptions(selection, {
          ...gridEvents,
          onOpenStack: (t) => setFetchOptions({ stackId: t.id })
        })}
      >
        {(!groupByDirectory || groupLimitExceeded) && (
          <VirtualTaggableGrid
            taggables={taggables}
            selection={selection}
            onSelect={selectItem}
            onRightClick={rightClickSelect}
            onDoubleClick={(t) => isTaggableStack(t) && setFetchOptions({ stackId: t.id })}
          />
        )}
        {groupByDirectory && !groupLimitExceeded && (
          <GroupedTaggableGrid
            groups={taggableGroups}
            selection={selection}
            onSelect={selectItem}
            onRightClick={rightClickSelect}
            onDoubleClick={(t) => isTaggableStack(t) && setFetchOptions({ stackId: t.id })}
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
            onCreateStack={() => onCreateStack && onCreateStack(selection)}
            onClear={() => setSelection([])}
          />
        </Box>
      </Fade>
    </Stack>
  )
}
