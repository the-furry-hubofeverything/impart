import {
  Box,
  Typography,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  useTheme
} from '@mui/material'
import { useState } from 'react'
import { Tag } from '../Tag'
import AddIcon from '@mui/icons-material/Add'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/Delete'
import { HexColorPicker } from 'react-colorful'
import CheckIcon from '@mui/icons-material/Check'

export interface TagGroupProps {
  group: Impart.TagGroup
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, selectedTags, onSelect }: TagGroupProps) {
  const theme = useTheme()
  const [internalLabel, setInternalLabel] = useState(group.label)
  const [internalColor, setInternalColor] = useState(
    group.defaultTagColor ?? theme.palette.primary.main
  )

  const [editMode, setEditMode] = useState(false)

  const { editGroup, createTag, deleteGroup } = useTagGroups()

  const [showRemoveWarning, setShowRemoveWarning] = useState(false)

  const update = async () => {
    await editGroup(group.id, internalLabel, internalColor)
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
        '& .fade-in-button': {
          opacity: 0,
          transition: '0.2s'
        },
        '&:hover .fade-in-button': {
          opacity: 1
        }
      }}
    >
      {editMode && (
        <Box position="relative">
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Box flex={1}>
              <TextField
                variant="standard"
                placeholder="Group Name"
                autoFocus
                fullWidth
                value={internalLabel}
                onChange={(e) => setInternalLabel(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    update()
                  }
                }}
              />
            </Box>
            <Box sx={{ width: 28, height: 28, borderRadius: 50, bgcolor: internalColor }}></Box>
            <IconButton onClick={update}>
              <CheckIcon />
            </IconButton>
          </Stack>
          <Box
            position="absolute"
            mt={1}
            zIndex={1}
            right={0}
            sx={{
              '& .react-colorful': {
                width: 150,
                height: 160
              }
            }}
          >
            <Paper sx={{ bgcolor: '#fff', borderRadius: 2 }}>
              <Stack p={1} gap={0.5}>
                <Typography variant="caption" textAlign="center">
                  Default Tag Color
                </Typography>
                <HexColorPicker color={internalColor} onChange={setInternalColor} />
              </Stack>
            </Paper>
          </Box>
        </Box>
      )}
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
