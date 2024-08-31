import { Card, CardContent, LinearProgress, Typography } from '@mui/material'
import { useTaggables } from '../TaggableProvider/TaggableProvider'

export interface IndexingPanelProps {}

export function IndexingPanel({}: IndexingPanelProps) {
  const { filesIndexed, total, indexingStep } = useTaggables()

  return (
    <Card>
      <CardContent>
        <Typography variant="body2">
          {indexingStep === 'indexing' && 'Indexing...'}
          {indexingStep === 'sourceAssociation' && 'Associating images with source files...'}
        </Typography>
        {total != 0 && (
          <LinearProgress value={(filesIndexed / total) * 100} variant="determinate" />
        )}
      </CardContent>
    </Card>
  )
}
