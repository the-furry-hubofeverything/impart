import { useFiles } from '../FileProvider/FileProvider'
import { Card, CardContent, LinearProgress, Typography } from '@mui/material'

export interface IndexingPanelProps {}

export function IndexingPanel({}: IndexingPanelProps) {
  const { filesIndexed, total } = useFiles()

  return (
    <Card>
      <CardContent>
        <Typography variant="body2">Indexing...</Typography>
        {total != 0 && (
          <LinearProgress value={(filesIndexed / total) * 100} variant="determinate" />
        )}
      </CardContent>
    </Card>
  )
}
