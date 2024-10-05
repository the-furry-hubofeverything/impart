import { Stack, Box, Card, CardActions, Fade } from '@mui/material'
import { ContextMenu } from '@renderer/common/ContextMenu'
import { VirtualTaggableGrid } from '@renderer/common/TaggableGrid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { GridActions } from './GridActions/GridActions'
import { SelectionIndicator } from './SelectionIndicator'
import { TaggableGridEvents, getTaggableContextMenuOptions } from './taggableContextMenuOptions'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { isTaggableStack } from '@renderer/common/taggable'
import { GeneratingThumbnailIndicator } from './GeneratingThumbnailIndicator'
import { useEditTags } from '../EditTagsProvider'

export interface BrowserPanelProps extends Omit<TaggableGridEvents, 'onHide' | 'onOpenStack'> {}

export function BrowserPanel({ ...gridEvents }: BrowserPanelProps) {
  const { onBulkTag, onCreateStack, onEditTags } = gridEvents
  const { taggables, setFetchOptions, fetchTaggables } = useTaggables()

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { selectItem, itemIsSelected } = useMultiSelection(
    taggables,
    selection,
    setSelection,
    useCallback((a, b) => a.id === b.id, [])
  )
  const rightClickSelect = useCallback(
    (item: Impart.Taggable) => {
      if (!itemIsSelected(item)) {
        selectItem(item)
      }
    },
    [selectItem, itemIsSelected]
  )

  const [stack, setStack] = useState<Impart.TaggableStack[]>([])

  const editState = useEditTags()

  useEffect(() => {
    editState && editState.editTarget && editState.saveAndClose()
  }, [selection])

  useEffect(() => {
    if (stack.length > 0) {
      setFetchOptions({ stackId: stack[stack.length - 1].id })
    } else {
      setFetchOptions({ stackId: undefined })
    }
  }, [stack])

  return (
    <ContextMenu
      options={getTaggableContextMenuOptions(selection, {
        ...gridEvents,
        onOpenStack: (t) => setStack(stack.concat([t])),
        onHide: async (taggables) => {
          await window.taggableApi.setHidden(
            taggables.map((t) => t.id),
            true
          )
          fetchTaggables()
        }
      })}
      render={({ isOpen: contextMenuOpen, open, close }) => (
        <Stack position={'relative'} height="100%" pr={1} gap={2} onClick={() => setSelection([])}>
          <Box mt={1} pl={1}>
            <Card>
              <CardActions>
                <GridActions stack={stack} onStackChange={setStack} />
              </CardActions>
            </Card>
          </Box>

          <VirtualTaggableGrid
            taggables={taggables}
            selection={selection}
            onSelect={(e, t) => {
              selectItem(t, e.ctrlKey, e.shiftKey)
              e.stopPropagation()
              close()
            }}
            onRightClick={(e, item) => {
              rightClickSelect(item)
              open(e)
            }}
            onDoubleClick={(t) => isTaggableStack(t) && setStack(stack.concat([t]))}
          />

          <Fade in={selection.length > 0}>
            <Box position="absolute" bottom={10} left={10}>
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
          <Box position="absolute" bottom={10} right={40}>
            <GeneratingThumbnailIndicator />
          </Box>
        </Stack>
      )}
    ></ContextMenu>
  )
}
