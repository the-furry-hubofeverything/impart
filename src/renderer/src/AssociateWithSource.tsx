import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Backable } from './Common/Components/Backable'
import { VirtualTaggableGrid } from './Common/Components/TaggableGrid'
import CheckIcon from '@mui/icons-material/Check'

export interface AssociateWithSourceProps {
  items: Impart.TaggableImage[]
  onFinish?: () => void
}

export function AssociateWithSource({ items, onFinish }: AssociateWithSourceProps) {
  const [isLoading, setLoading] = useState(false)

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1} alignItems="center">
          <Typography variant="h2">Associate With Source Files</Typography>
          <Stack flex={1} justifyContent="center" alignItems="center" gap={2}>
            <Box flex="1 1 0" width="100%" overflow="auto">
              <VirtualTaggableGrid />
            </Box>
          </Stack>
        </Stack>
        <Box width={500}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <Stack gap={4} height="100%">
                <Box flex={1}>
                  <Typography fontSize={32}>Selected File:</Typography>
                  [FILE]
                </Box>
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={async () => {
                      // await save()
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
