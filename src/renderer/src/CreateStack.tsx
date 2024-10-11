import React, { useState } from 'react'
import { Backable } from './common/Backable'
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
import { TaggableGrid } from './common/TaggableGrid'
import CheckIcon from '@mui/icons-material/Check'
import { TaggableDisplay } from './common/TaggableDisplay'
import { useImpartIpcCall } from './common/useImpartIpc'

export interface CreateStackProps {
  items: Impart.Taggable[]
  onFinish?: () => void
}

export function CreateStack({ onFinish, items }: CreateStackProps) {
  const [coverImage, setCoverImage] = useState<Impart.Taggable>()
  const [name, setName] = useState('')

  const { callIpc: save, isLoading } = useImpartIpcCall(
    () =>
      window.taggableApi.createStack(
        name,
        items.map((t) => t.id),
        coverImage?.id ?? -1
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
              <TaggableGrid taggables={items} onMouseDown={(e, item) => setCoverImage(item)} />
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
                  {!coverImage && <Typography fontStyle="italic">None Selected</Typography>}
                  {coverImage && <TaggableDisplay taggable={coverImage} />}
                </Box>
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!name || !coverImage}
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
