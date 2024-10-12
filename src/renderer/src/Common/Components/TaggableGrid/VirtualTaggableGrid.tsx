import { Box, Grid2 as Grid, Stack } from '@mui/material'
import { TaggableDisplay } from '@renderer/Common/Components/TaggableDisplay'
import { forwardRef } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'
import { BOX_WIDTH } from '../TaggableDisplay/TaggableDisplay'
import { CommonTaggableGridProps } from './TaggableGrid'
import { useEditTags } from '@renderer/TaggableBrowser/EditTagsProvider'
import { useScrollLock } from '../../Hooks/useScrollLock'
import { Draggable } from '../DragAndDrop/Draggable'
import { Droppable } from '../DragAndDrop/Droppable'

const gridComponents: GridComponents = {
  List: forwardRef(({ children, ...props }, ref) => (
    <Grid container {...props} ref={ref}>
      {children}
    </Grid>
  )),
  Item: forwardRef(({ children, ...props }, ref) => (
    <Grid minWidth={BOX_WIDTH + 28} {...props} ref={ref} size={{ xs: 'grow' }}>
      {children}
    </Grid>
  ))
}

export function VirtualTaggableGrid({
  taggables,
  selection,
  onMouseDown,
  onRightClick,
  onDoubleClick
}: CommonTaggableGridProps) {
  if (!taggables) {
    return null
  }

  const editState = useEditTags()
  const handleScroll = useScrollLock(editState && editState.editTarget != null)

  return (
    <VirtuosoGrid
      data={taggables}
      totalCount={taggables.length}
      components={gridComponents}
      onScroll={handleScroll}
      computeItemKey={(index, item) => item.id}
      itemContent={(index, f) => (
        <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
          <Droppable
            type="taggable"
            id={f.id}
            render={({ overType }) => (
              <Draggable id={f.id} type="taggable">
                <Box
                  onContextMenu={(e) => {
                    onRightClick && onRightClick(e, f)
                  }}
                  onMouseDown={(e) => onMouseDown && onMouseDown(e, f)}
                  onDoubleClick={() => onDoubleClick && onDoubleClick(f)}
                >
                  <TaggableDisplay
                    taggable={f}
                    isSelected={selection?.some((s) => s.id === f.id)}
                    showTags={overType === 'tag'}
                  />
                </Box>
              </Draggable>
            )}
          ></Droppable>
        </Stack>
      )}
    />
  )
}
