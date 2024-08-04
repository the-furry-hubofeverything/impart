import {
  Stack,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  IconButton
} from '@mui/material'
import { useFiles } from '@renderer/FileProvider'
import { TagSelector } from '@renderer/common/TagSelector'
import { useAsyncData } from '@renderer/common/useAsyncData'
import { useEffect, useState } from 'react'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  const [selection, setSelection] = useState<Impart.Tag[]>([])
  const { fetchAllFiles } = useFiles()

  useEffect(() => {
    fetchAllFiles(selection.map((t) => t.id))
  }, [fetchAllFiles, selection])

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <TagSelector selection={selection} onChange={setSelection} />
      </CardContent>
    </Card>
  )
}
