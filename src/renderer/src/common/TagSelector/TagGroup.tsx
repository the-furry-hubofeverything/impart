import {
  Box,
  Typography,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import { useState } from 'react'
import { Tag } from '../Tag'
import AddIcon from '@mui/icons-material/Add'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/Delete'
import { EditTagGroup } from './EditTagGroup'

export interface TagGroupProps {
  group: Impart.TagGroup
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, selectedTags, onSelect }: TagGroupProps) {
  const [editMode, setEditMode] = useState(false)

  const { createTag, deleteGroup } = useTagGroups()

  const [showRemoveWarning, setShowRemoveWarning] = useState(false)

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
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" onClick={() => setEditMode(true)}>
              {group.label ?? 'Unnamed Group'}
            </Typography>
            <IconButton className="fade-in-button" color="error" onClick={remove}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          <Divider />
        </>
      )}

      <Grid container py={1} spacing={2}>
        {group.tags?.map((t) => (
          <Grid key={t.id}>
            <Tag
              tag={t}
              editable
              onClick={() => onSelect && onSelect(t)}
              selected={selectedTags?.some((s) => s.id === t.id)}
            />
          </Grid>
        ))}
        <Grid>
          <IconButton size="small" onClick={() => createTag(group.id)} className="fade-in-button">
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
