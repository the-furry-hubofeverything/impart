import { Box, Typography, Divider, IconButton, Stack, darken, Collapse } from '@mui/material'
import { useState } from 'react'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import { EditTagGroup } from './EditTagGroup'
import { useConfirmationDialog } from '../ConfirmationDialogProvider'
import { useDraggableHandle } from '../DragAndDrop/DraggableHandleProvider'
import DragIndicatorIcon from '@mui/icons-material/DragIndicatorRounded'
import { useImpartIpcCall } from '@renderer/Common/Hooks/useImpartIpc'
import { GroupTagList } from './GroupTagList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

export interface TagGroupProps {
  group: Impart.TagGroup
  filter?: string
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, filter, selectedTags, onSelect }: TagGroupProps) {
  const [editMode, setEditMode] = useState(false)
  const [showTags, setShowTags] = useState(true)
  const { reload } = useTagGroups()

  const { callIpc: deleteGroup, isLoading: isDeleting } = useImpartIpcCall(
    () => window.tagApi.deleteGroup(group.id),
    [group.id]
  )

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
          await deleteGroup()
          reload()
        }
      )
    } else {
      await deleteGroup()
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
              <Stack direction="row">
                <IconButton
                  className="fade-in-button"
                  color="error"
                  onClick={remove}
                  disabled={isDeleting}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => setShowTags(!showTags)} size="small">
                  {showTags ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Stack>
            </Stack>
            <Divider />
          </Box>
        </Stack>
      )}

      <Collapse in={showTags}>
        <GroupTagList
          tags={group.tags}
          groupId={group.id}
          filter={filter}
          selectedTags={selectedTags}
          onSelect={onSelect}
          onAdd={reload}
        />
      </Collapse>
    </Box>
  )
}
