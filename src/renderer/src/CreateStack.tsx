import React, { useState } from 'react'
import { Backable } from './Common/Components/Backable'
import {
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress
} from '@mui/material'
import { TaggableGrid } from './Common/Components/TaggableGrid'
import CheckIcon from '@mui/icons-material/Check'
import { TaggableDisplay } from './Common/Components/TaggableDisplay'
import { useImpartIpcCall } from './Common/Hooks/useImpartIpc'
import { useTaggables } from './EntityProviders/TaggableProvider'
import { isTaggableImage } from './Common/taggable'

export interface CreateStackProps {
  items: Impart.Taggable[]
  onFinish?: () => void
}

export function CreateStack({ onFinish, items }: CreateStackProps) {
  const [coverImage, setCoverImage] = useState(items.find(isTaggableImage))
  const [name, setName] = useState('')
  const {
    fetchOptions: { stackId }
  } = useTaggables()

  const { callIpc: save, isLoading } = useImpartIpcCall(
    () =>
      window.stackApi.create(
        name,
        items.map((t) => t.id),
        coverImage?.id ?? -1,
        stackId
      ),
    [name, items, coverImage]
  )

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Create Stack</Typography>
          <Stack flex={1} justifyContent="center" alignItems="center" gap={2}>
            <Box flex="1 1 0" width="100%" overflow="auto">
              <TaggableGrid
                taggables={items}
                onMouseDown={(e, item) => isTaggableImage(item) && setCoverImage(item)}
              />
            </Box>
          </Stack>
        </Stack>
        <Box width={500}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <Stack gap={4} height="100%">
                <TextField
                  label="Name"
                  value={name}
                  fullWidth
                  onChange={(e) => setName(e.currentTarget.value)}
                />
                <Box flex={1}>
                  <Typography fontSize={32}>Cover:</Typography>
                  {!coverImage && (
                    <Box textAlign="center">
                      <Typography>None Selected!</Typography>
                      <Typography variant="body2" fontStyle="italic" fontSize={12}>
                        Select an image to set it as the cover of this stack.
                      </Typography>
                    </Box>
                  )}
                  {coverImage && (
                    <Box onClick={() => setCoverImage(undefined)}>
                      <TaggableDisplay taggable={coverImage} />
                    </Box>
                  )}
                </Box>
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!name}
                    startIcon={<CheckIcon />}
                    onClick={async () => {
                      await save()
                      onFinish && onFinish()
                    }}
                  >
                    Save
                  </Button>
                )}
                {isLoading && <CircularProgress />}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Backable>
  )
}
