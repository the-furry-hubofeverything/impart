import { Box, CssBaseline, Stack, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { FileIndexStatusProvider } from './FileIndexStatusProvider'
import { ImageGrid } from './ImageGrid'
import { TaggingPanel } from './TaggingPanel'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FileIndexStatusProvider>
        <Stack direction="row" p={2} gap={2} height="100vh">
          <Box flex={1} overflow="auto">
            <ImageGrid />
          </Box>
          <Box width={300}>
            <TaggingPanel />
          </Box>
        </Stack>
      </FileIndexStatusProvider>
    </ThemeProvider>
  )
}
