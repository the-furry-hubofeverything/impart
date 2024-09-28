import React from 'react'
import { Backable } from './common/Backable'
import { Stack, Typography, Box, Card, CardContent, Button } from '@mui/material'
import { TaggableGrid } from './common/TaggableGrid'
import CheckIcon from '@mui/icons-material/Check'

export interface CreateStackProps {
  items?: Impart.Taggable[]
  onFinish?: () => void
}

export function CreateStack({ onFinish, items }: CreateStackProps) {
  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Create Stack</Typography>
          <Stack flex={1} justifyContent="center" alignItems="center" gap={2}>
            <Box flex="1 1 0" width="100%" overflow="auto">
              <TaggableGrid taggables={items} />
            </Box>
          </Stack>
        </Stack>
        <Box width={500}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <Button variant="contained" color="success" startIcon={<CheckIcon />}>
                Save
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Backable>
  )
}
