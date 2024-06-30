import { Card, CardActions, IconButton, Stack, Tooltip } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import SettingsIcon from '@mui/icons-material/Settings'

export interface SettingsPanelProps {
  onClick?: (button: 'directories') => void
}

export function SettingsPanel({ onClick }: SettingsPanelProps) {
  return (
    <Card sx={{ opacity: 0.3, transition: '0.2s', '&:hover': { opacity: 1 } }}>
      <CardActions>
        <Stack direction="row" gap={0.5}>
          <Tooltip title="Folders">
            <IconButton onClick={() => onClick && onClick('directories')}>
              <FolderIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  )
}
