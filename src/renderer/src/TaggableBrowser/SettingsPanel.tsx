import { Card, IconButton, Stack, Tooltip } from '@mui/material'

import SettingsIcon from '@mui/icons-material/Settings'

export interface SettingsPanelProps {
  onClick?: () => void
}

export function SettingsPanel({ onClick }: SettingsPanelProps) {
  return (
    <Card>
      <Stack direction="row" p={0.25} alignItems={'center'}>
        <Tooltip title="Folders">
          <IconButton onClick={() => onClick && onClick()}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  )
}
