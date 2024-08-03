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
import AddIcon from '@mui/icons-material/Add'
import { useAsyncData } from '@renderer/common/useAsyncData'

export interface TaggingPanelProps {}

export function TaggingPanel({}: TaggingPanelProps) {
  const { data: groups, isLoading } = useAsyncData(() => window.tagApi.getGroups(), [])

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Stack gap={2}>
          {groups?.map((g) => (
            <Box
              key={g.id}
              sx={{
                '& .MuiIconButton-root': {
                  opacity: 0,
                  transition: '0.2s'
                },
                '&:hover .MuiIconButton-root': {
                  opacity: 1
                }
              }}
            >
              <Typography variant="h5">{g.label}</Typography>
              <Divider />
              <Grid container py={1} spacing={1}>
                {g.tags.map((t) => (
                  <Grid key={t.id} item>
                    <Chip
                      label={t.label}
                      sx={(theme) => ({
                        bgcolor: t.color,
                        color: theme.palette.getContrastText(t.color),
                        cursor: 'pointer',
                        transition: '0.2s',

                        '&:hover': {
                          opacity: 0.9
                        }
                      })}
                    />
                  </Grid>
                ))}
                <Grid item>
                  <IconButton size="small">
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
