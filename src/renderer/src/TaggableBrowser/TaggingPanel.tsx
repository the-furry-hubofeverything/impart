import { Card, CardContent } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TagSelector } from '@renderer/common/TagSelector'
import { useEffect, useState } from 'react'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  const [selection, setSelection] = useState<Impart.Tag[]>([])
  const { startNewFetch } = useTaggables()

  useEffect(() => {
    startNewFetch(selection.map((t) => t.id))
  }, [startNewFetch, selection])

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ height: '100%' }}>
        <TagSelector selection={selection} onChange={setSelection} />
      </CardContent>
    </Card>
  )
}
