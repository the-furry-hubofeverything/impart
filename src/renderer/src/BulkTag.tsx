import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { TagSelector } from './Common/Components/TagSelector'
import { Tag } from './Common/Components/Tag'
import CheckIcon from '@mui/icons-material/Check'
import BackIcon from '@mui/icons-material/ArrowBack'
import { TaggableDisplay } from './Common/Components/TaggableDisplay'
import { TaggableGrid } from './Common/Components/TaggableGrid'
import InfoIcon from '@mui/icons-material/Info'
import { Backable } from './Common/Components/Backable'

export interface BulkTagProps {
  items: Impart.Taggable[]
  onFinish?: () => void
}

export function BulkTag({ items, onFinish }: BulkTagProps) {
  const [tagSelection, setTagSelection] = useState<Impart.Tag[]>([])

  const removeFromSelection = (tag: Impart.Tag) => {
    const copy = tagSelection.slice()
    copy.splice(
      copy.findIndex((c) => c.id === tag.id),
      1
    )
    setTagSelection(copy)
  }

  const save = async () => {
    await window.tagApi.bulkTag(
      items.map((i) => i.id),
      tagSelection.map((t) => t.id)
    )
    onFinish && onFinish()
  }

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Bulk Tags</Typography>
          <Typography>Add tags to multiple items at once. Repeat tags will be ignored.</Typography>

          <Stack flex={1} justifyContent="center" alignItems="center" gap={2}>
            <Box flex="1 1 0" width="100%" overflow="auto">
              <TaggableGrid taggables={items} />
            </Box>
            <Grid container spacing={1} width="unset">
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
