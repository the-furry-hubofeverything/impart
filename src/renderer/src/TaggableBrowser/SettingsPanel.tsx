import { Card, CardActions, IconButton, Stack, TextField, Tooltip } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import SettingsIcon from '@mui/icons-material/Settings'

export interface SettingsPanelProps {
  onClick?: (button: 'directories') => void
}

export function SettingsPanel({ onClick }: SettingsPanelProps) {
  return (
    <Card>
      <Stack direction="row" p={0.25} alignItems={'center'}>
        <Tooltip title="Folders">
          <IconButton onClick={() => onClick && onClick('directories')}>
            <FolderIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  )
}
