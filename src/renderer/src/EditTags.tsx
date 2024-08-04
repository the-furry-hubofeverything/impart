import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ImageDisplay } from './common/ImageDisplay'
import { TagSelector } from './common/TagSelector'
import { Tag } from './common/Tag'

export interface EditTagsProps {
  item: Impart.TaggableImage
}

export function EditTags({ item }: EditTagsProps) {
  const [tagSelection, setTagSelection] = useState(item.tags ?? [])

  const removeFromSelection = (tag: Impart.Tag) => {
    const copy = tagSelection.slice()
    copy.splice(
      copy.findIndex((c) => c.id === item.id),
      1
    )
    setTagSelection(copy)
  }

  return (
    <Box>
      <Stack direction="row" p={1} gap={1} height="100vh">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Edit Tags</Typography>
          <Stack flex={1} justifyContent="center" alignItems="center" gap={4}>
            <Box>
              <ImageDisplay image={item} />
            </Box>
            <Grid container spacing={1}>
              {tagSelection.map((t) => (
                <Grid key={t.id} item>
                  <Tag tag={t} onClick={() => removeFromSelection(t)} />
                </Grid>
              ))}
            </Grid>
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
