import { Box, Typography, Divider, Grid, IconButton, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Tag } from '../Tag'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useTagGroups } from '@renderer/TagProvider'

export interface TagGroupProps {
  group: Impart.TagGroup
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, selectedTags, onSelect }: TagGroupProps) {
  const [internalLabel, setInternalLabel] = useState(group.label)
  const [editMode, setEditMode] = useState(false)

  const { editGroup } = useTagGroups()

  const update = async () => {
    await editGroup(group.id, internalLabel)
    setEditMode(false)
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
          />
        </Stack>
      )}
      {!editMode && (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" onClick={() => setEditMode(true)}>
              {group.label ?? 'Unnamed Group'}
            </Typography>
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
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}
