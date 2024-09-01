import {
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import React, { useState } from 'react'
import { Tag } from '../Tag'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/Delete'

export interface TagGroupProps {
  group: Impart.TagGroup
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, selectedTags, onSelect }: TagGroupProps) {
  const [internalLabel, setInternalLabel] = useState(group.label)
  const [editMode, setEditMode] = useState(false)

  const { editGroup, createTag, deleteGroup } = useTagGroups()

  const [showRemoveWarning, setShowRemoveWarning] = useState(false)

  const update = async () => {
    await editGroup(group.id, internalLabel)
    setEditMode(false)
  }

  const remove = () => {
    if ((group.tags?.length ?? 0) > 0) {
      setShowRemoveWarning(true)
    } else {
      deleteGroup(group.id)
    }
  }

  return (
    <Box
      key={group.id}
      sx={{
        '& .MuiIconButton-root': {
          opacity: 0,
          transition: '0.2s'
        },
        '&:hover .MuiIconButton-root': {
          opacity: 1
        }
      }}
    >
      {editMode && (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            variant="standard"
            placeholder="Group Name"
            autoFocus
            fullWidth
            value={internalLabel}
            onChange={(e) => setInternalLabel(e.currentTarget.value)}
            onBlur={update}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                update()
              }
            }}
          />
        </Stack>
      )}
      {!editMode && (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" onClick={() => setEditMode(true)}>
              {group.label ?? 'Unnamed Group'}
            </Typography>
            <IconButton color="error" onClick={remove}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          <Divider />
        </>
      )}

      <Grid container py={1} spacing={2}>
        {group.tags?.map((t) => (
          <Grid key={t.id} item>
            <Tag
              tag={t}
              onClick={() => onSelect && onSelect(t)}
              selected={selectedTags?.some((s) => s.id === t.id)}
            />
          </Grid>
        ))}
        <Grid item>
          <IconButton size="small" onClick={() => createTag(group.id)}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Dialog open={showRemoveWarning} onClose={() => setShowRemoveWarning(false)}>
        <DialogTitle>Remove Group?</DialogTitle>
        <DialogContent>
          This will remove {group.tags?.length} tags as well. This action cannot be reversed.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemoveWarning(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => deleteGroup(group.id)}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
