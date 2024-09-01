import { Card, CardContent, LinearProgress, Typography } from '@mui/material'
import { useTaggables } from '../EntityProviders/TaggableProvider/TaggableProvider'
import { useEffect, useState } from 'react'

export interface IndexingPanelProps {}

export function IndexingPanel({}: IndexingPanelProps) {
  const { filesIndexed, total, indexingStep, isIndexing } = useTaggables()

  return (
    <Card>
      <CardContent>
        <Typography variant="body2">
          {isIndexing && indexingStep === 'indexing' && 'Indexing...'}
          {isIndexing &&
            indexingStep === 'sourceAssociation' &&
            'Associating images with source files...'}
          {!isIndexing && 'Finished indexing'}
        </Typography>
        {total != 0 && (
          <LinearProgress value={(filesIndexed / total) * 100} variant="determinate" />
        )}
      </CardContent>
    </Card>
  )
}
