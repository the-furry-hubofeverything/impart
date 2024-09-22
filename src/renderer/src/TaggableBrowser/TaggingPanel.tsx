import { Card, CardContent } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TagSelector } from '@renderer/common/TagSelector'
import { useEffect, useState } from 'react'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  const [selection, setSelection] = useState<Impart.Tag[]>([])
  const { setFetchOptions } = useTaggables()

  useEffect(() => {
    setFetchOptions({ tagIds: selection.map((t) => t.id) })
  }, [selection])

  return (
    <Card sx={{ flex: 1, overflowY: 'auto' }}>
      <CardContent sx={{ height: '100%' }}>
        <TagSelector selection={selection} onChange={setSelection} />
      </CardContent>
    </Card>
  )
}
