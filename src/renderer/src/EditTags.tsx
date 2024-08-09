import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { TagSelector } from './common/TagSelector'
import { Tag } from './common/Tag'
import CheckIcon from '@mui/icons-material/Check'
import BackIcon from '@mui/icons-material/ArrowBack'
import { TaggableDisplay } from './common/TaggableDisplay'

export interface EditTagsProps {
  item: Impart.Taggable
  onFinish?: () => void
}

export function EditTags({ item, onFinish }: EditTagsProps) {
  const [tagSelection, setTagSelection] = useState(item.tags ?? [])

  const removeFromSelection = (tag: Impart.Tag) => {
    const copy = tagSelection.slice()
    copy.splice(
      copy.findIndex((c) => c.id === item.id),
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
    <Box position="relative">
      <Box position="absolute" top={20} left={20}>
        <IconButton onClick={onFinish} size="large">
          <BackIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Stack direction="row" p={1} gap={1} height="100vh">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Edit Tags</Typography>
          <Stack flex={1} justifyContent="center" alignItems="center" gap={4}>
            <Box>
              <TaggableDisplay taggable={item} />
            </Box>
            <Grid container spacing={1}>
              {tagSelection.map((t) => (
                <Grid key={t.id} item>
                  <Tag tag={t} onClick={() => removeFromSelection(t)} />
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={save}>
              Save
            </Button>
          </Stack>
        </Stack>
        <Box flex={1} alignItems="center">
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <TagSelector selection={tagSelection} onChange={(s) => setTagSelection(s)} />
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  )
}
