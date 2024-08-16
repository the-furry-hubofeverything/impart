import { Box, Typography, Divider, Grid, IconButton, Stack } from '@mui/material'
import React, { useState } from 'react'
import { Tag } from '../Tag'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

export interface TagGroupProps {
  group: Impart.TagGroup
  selectedTags?: Impart.Tag[]
  startInEditMode?: boolean
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, selectedTags, startInEditMode, onSelect }: TagGroupProps) {
  const [editMode, setEditMode] = useState(startInEditMode)

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
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">{group.label}</Typography>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Stack>
      <Divider />
      <Grid container py={1} spacing={2}>
        {group.tags.map((t) => (
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
