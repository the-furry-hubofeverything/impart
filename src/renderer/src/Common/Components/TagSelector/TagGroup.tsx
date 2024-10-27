import {
  Box,
  Typography,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  darken,
  BoxProps,
  styled
} from '@mui/material'
import { useState } from 'react'
import { Tag } from '../Tag'
import AddIcon from '@mui/icons-material/Add'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/Delete'
import { EditTagGroup } from './EditTagGroup'
import { Draggable } from '../DragAndDrop/Draggable'
import { useConfirmationDialog } from '../ConfirmationDialogProvider'
import { useDraggableHandle } from '../DragAndDrop/DraggableHandleProvider'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Droppable } from '../DragAndDrop/Droppable'

const DropIndicator = styled(Box)<BoxProps & { showIndicator: boolean }>(
  ({ showIndicator, theme }) =>
    showIndicator
      ? {
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          marginLeft: '-6px',
          paddingLeft: '3px'
        }
      : {}
)

export interface TagGroupProps {
  group: Impart.TagGroup
  filter?: string
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, filter, selectedTags, onSelect }: TagGroupProps) {
  const [editMode, setEditMode] = useState(false)
  const { reload } = useTagGroups()

  const confirm = useConfirmationDialog()

  const remove = async () => {
    if ((group.tags?.length ?? 0) > 0) {
      confirm(
        {
          title: 'Remove Group?',
          body: `This will remove ${group.tags?.length} tags as well. This action cannot be reversed.`,
          danger: true,
          confirmText: 'Delete',
          confirmIcon: <DeleteIcon />
        },
        async () => {
          await window.tagApi.deleteGroup(group.id)
          reload()
        }
      )
    } else {
      await window.tagApi.deleteGroup(group.id)
      reload()
    }
  }

  const dragHandle = useDraggableHandle()

  return (
    <Box
      key={group.id}
      sx={{
        '& .fade-in-button': {
          opacity: 0,
          transition: '0.2s'
        },
        '&:hover .fade-in-button': {
          opacity: 1
        }
      }}
    >
      <EditTagGroup group={group} show={editMode} onClose={() => setEditMode(false)} />
      {!editMode && (
        <Stack direction="row" gap={1}>
          <Stack
            justifyContent="center"
            borderRadius={2}
            sx={(theme) => ({
              transition: '0.2s',
              '&:hover': { bgcolor: darken(theme.palette.background.paper, 0.1) }
            })}
            {...dragHandle}
          >
            <DragIndicatorIcon />
          </Stack>
          <Box flex={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" onClick={() => setEditMode(true)}>
                {group.label ?? 'Unnamed Group'}
              </Typography>
              <IconButton className="fade-in-button" color="error" onClick={remove}>
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Divider />
          </Box>
        </Stack>
      )}

      <Grid container py={1} spacing={2}>
        {group.tags
          ?.slice()
          .filter((t) => !filter || filter.split(' ').every((term) => t.label?.includes(term)))
          .sort((a, b) => a.tagOrder - b.tagOrder)
          .map((t) => (
            <Grid key={t.id}>
              <Droppable
                type="tag"
                id={t.id}
                render={({ overType }) => (
                  <DropIndicator showIndicator={overType != null}>
                    <Draggable id={t.id} type="tag">
                      <Tag
                        tag={t}
                        editable
                        onClick={() => onSelect && onSelect(t)}
                        selected={selectedTags?.some((s) => s.id === t.id)}
                      />
                    </Draggable>
                  </DropIndicator>
                )}
              />
            </Grid>
          ))}
        <Grid>
          <Droppable
            type="tagGroupEnd"
            id={group.id}
            render={({ overType }) => (
              <DropIndicator showIndicator={overType != null}>
                <IconButton
                  size="small"
                  onClick={async () => {
                    await window.tagApi.createTag(group.id)
                    reload()
                  }}
                  className="fade-in-button"
                >
                  <AddIcon />
                </IconButton>
              </DropIndicator>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
