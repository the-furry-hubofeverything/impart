import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs
} from '@mui/material'
import React, { useState } from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import CloseIcon from '@mui/icons-material/Close'
import { IndexedDirectoriesSettings } from './IndexedDirectorySettings'
import { TaskStatus } from '@renderer/common/TaskStatus'
import { useTaskStatus } from '@renderer/TaskStatusProvider'

type SettingsType = 'directories' | 'TODO'

export interface SettingsProps {
  onClose?: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const [selectedTab, setSelectedTab] = useState<SettingsType>('directories')

  const { isTaskRunning } = useTaskStatus()

  const test = false

  return (
    <Stack height="100%" justifyContent="center">
      <Card sx={{ height: '100%', position: 'relative' }}>
        <Box position="absolute" top={5} right={20} zIndex={1}>
          <IconButton size="large" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box sx={{ height: '100%' }}>
          <Stack direction="row" gap={2} height={'100%'}>
            <Stack
              alignItems="flex-end"
              height={'100%'}
              sx={(theme) => ({
                bgcolor: '#cae6e0',
                borderRight: `2px solid ${theme.palette.primary.main}`
              })}
            >
              <Tabs
                orientation="vertical"
                value={selectedTab}
                onChange={(e, value) => setSelectedTab(value)}
                sx={{
                  marginRight: '-2px'
                }}
                TabIndicatorProps={{ sx: (theme) => ({ bgcolor: theme.palette.background.paper }) }}
              >
                <Tab label="Directories" value="directories" icon={<FolderIcon />} />
              </Tabs>
            </Stack>
            <Box flex={1} p={1} pr={8} height="100%" sx={{ overflowY: 'scroll' }}>
              {selectedTab === 'directories' && <IndexedDirectoriesSettings />}
            </Box>
          </Stack>
        </Box>
      </Card>
    </Stack>
  )
}
