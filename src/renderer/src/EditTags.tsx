import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { TagSelector } from './common/TagSelector'
import { Tag } from './common/Tag'
import CheckIcon from '@mui/icons-material/Check'
import BackIcon from '@mui/icons-material/ArrowBack'
import { TaggableDisplay } from './common/TaggableDisplay'
import { Backable } from './common/Backable'

export interface EditTagsProps {
  item: Impart.Taggable
  onFinish?: () => void
}

export function EditTags({ item, onFinish }: EditTagsProps) {
  const [tagSelection, setTagSelection] = useState(item.tags ?? [])

  useEffect(() => {
    setTagSelection(item.tags)
  }, [item.tags])

  const removeFromSelection = (tag: Impart.Tag) => {
    const copy = tagSelection.slice()
    copy.splice(
      copy.findIndex((c) => c.id === tag.id),
      1
    )
    setTagSelection(copy)
  }

  const save = async () => {
    await window.tagApi.editFileTags(
      item.id,
      tagSelection.map((t) => t.id)
    )
    onFinish && onFinish()
  }

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Edit Tags</Typography>
          <Stack flex={1} justifyContent="center" alignItems="center" gap={4}>
            <Box>
              <TaggableDisplay taggable={item} />
            </Box>
            <Grid container spacing={1}>
              {tagSelection.map((t) => (
                <Grid key={t.id}>
                  <Tag tag={t} onClick={() => removeFromSelection(t)} />
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={save}>
              Save
            </Button>
          </Stack>
        </Stack>
        <Box width={500}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <TagSelector selection={tagSelection} onChange={setTagSelection} />
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Backable>
  )
}
