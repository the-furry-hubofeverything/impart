import { Stack, Box, Collapse, Card, CardContent } from '@mui/material'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { TaskStatus } from '../common/TaskStatus'
import { TaggableGridEvents } from './BrowserPanel/taggableContextMenuOptions'
import { useShowIndexingPanel } from './useShowIndexingPanel'
import { BrowserPanel } from './BrowserPanel'

export interface TaggableBrowserProps extends TaggableGridEvents {
  onSettingsPressed?: () => void
}

export function TaggableBrowser({ onSettingsPressed, ...gridEvents }: TaggableBrowserProps) {
  const showIndexingPanel = useShowIndexingPanel()

  return (
    <Stack direction="row" gap={1} height="100vh">
      <BrowserPanel {...gridEvents} />
      <Box minWidth={300} flex={0.25} py={1} pr={1}>
        <Stack width="100%" height="100%">
          <TaggingPanel />
          <Collapse in={showIndexingPanel}>
            <Box pt={2}>
              <Card>
                <CardContent>
                  <TaskStatus />
                </CardContent>
              </Card>
            </Box>
          </Collapse>
          <Box pt={2}>
            <SettingsPanel onClick={() => onSettingsPressed && onSettingsPressed()} />
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
