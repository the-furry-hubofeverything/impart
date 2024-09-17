import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs
} from '@mui/material'
import React, { useState } from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import CloseIcon from '@mui/icons-material/Close'
import { IndexedDirectoriesSettings } from './IndexedDirectoriesSettings'

type SettingsType = 'directories' | 'TODO'

export interface SettingsProps {
  onClose?: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const [selectedTab, setSelectedTab] = useState<SettingsType>('directories')

  console.log(selectedTab)

  return (
    <Stack p={3} height="100%" justifyContent="center">
      <Card sx={{ maxHeight: '100%', position: 'relative' }}>
        <Box position="absolute" top={5} right={5}>
          <IconButton size="large" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <CardContent>
          <Stack direction="row" gap={2}>
            <Stack minWidth={200} alignItems="flex-end">
              <Tabs
                orientation="vertical"
                value={selectedTab}
                onChange={(e, value) => setSelectedTab(value)}
              >
                <Tab label="Directories" value="directories" icon={<FolderIcon />} />
              </Tabs>
            </Stack>
            {selectedTab === 'directories' && <IndexedDirectoriesSettings />}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
