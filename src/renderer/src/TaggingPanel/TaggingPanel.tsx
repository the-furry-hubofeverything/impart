import { Stack, Card, CardContent, Typography, Collapse, Box } from '@mui/material'
import { useFileIndexStatus } from '../FileIndexStatusProvider'
import { IndexingPanel } from './IndexingPanel'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  const { isIndexing } = useFileIndexStatus()

  return (
    <Stack width="100%" height="100%">
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography>Content goes here</Typography>
        </CardContent>
      </Card>
      <Collapse in={isIndexing}>
        <Box pt={2}>
          <IndexingPanel />
        </Box>
      </Collapse>
    </Stack>
  )
}
