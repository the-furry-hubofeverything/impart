import {
  Stack,
  Card,
  CardContent,
  Collapse,
  Box,
  Button,
  Typography,
  Divider,
  Grid,
  Chip
} from '@mui/material'
import { useFileIndexStatus } from '../FileIndexStatusProvider'
import { IndexingPanel } from './IndexingPanel'
import AddIcon from '@mui/icons-material/Add'
import { useAsyncData } from '@renderer/common/useAsyncData'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  const { isIndexing } = useFileIndexStatus()

  const { data: groups, isLoading } = useAsyncData(() => window.tagApi.getGroups(), [])

  return (
    <Stack width="100%" height="100%">
      <Card sx={{ flex: 1 }}>
        <CardContent>
          {groups?.map((g) => (
            <Box key={g.id}>
              <Typography variant="h5">{g.label}</Typography>
              <Divider />
              <Grid container pt={1} pb={3} spacing={1}>
                {g.tags.map((t) => (
                  <Grid key={t.id} item>
                    <Chip
                      label={t.label}
                      sx={(theme) => ({
                        bgcolor: t.color,
                        color: theme.palette.getContrastText(t.color)
                      })}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
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
