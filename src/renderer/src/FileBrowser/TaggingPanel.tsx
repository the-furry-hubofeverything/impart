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
import { TagSelector } from '@renderer/common/TagSelector'
import { useAsyncData } from '@renderer/common/useAsyncData'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <TagSelector />
      </CardContent>
    </Card>
  )
}
