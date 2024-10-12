import { Box, Stack, TextField, IconButton, Paper, Typography, useTheme, Fade } from '@mui/material'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

export interface EditTagGroupProps {
  group: Impart.TagGroup
  show: boolean
  onClose: () => void
}

export function EditTagGroup({ group, onClose, show }: EditTagGroupProps) {
  const theme = useTheme()
  const [internalLabel, setInternalLabel] = useState(group.label)
  const [internalColor, setInternalColor] = useState(
    group.defaultTagColor ?? theme.palette.primary.main
  )

  const { reload } = useTagGroups()

  if (!show) {
    return null
  }

  const update = async () => {
    await window.tagApi.editGroup(group.id, internalLabel, internalColor)
    reload()
    onClose()
  }

  return (
    <Box position="relative">
      {show && (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <TextField
              variant="standard"
              placeholder="Group Name"
              autoFocus
              fullWidth
              value={internalLabel}
              onChange={(e) => setInternalLabel(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  update()
                }
                if (e.key === 'Escape') {
                  onClose()
                }
              }}
            />
          </Box>
          <Box
            mx={1}
            sx={{ width: 28, height: 28, borderRadius: 50, bgcolor: internalColor }}
          ></Box>
          <IconButton onClick={onClose}>
            <ClearIcon />
          </IconButton>
          <IconButton color="success" onClick={update}>
            <CheckIcon />
          </IconButton>
        </Stack>
      )}
      <Fade in={show}>
        <Box
          position="absolute"
          mt={1}
          zIndex={1}
          right={0}
          sx={{
            '& .react-colorful': {
              width: 150,
              height: 160
            }
          }}
        >
          <Paper sx={{ bgcolor: '#fff', borderRadius: 2 }}>
            <Stack p={1} gap={0.5}>
              <Typography variant="caption" textAlign="center">
                Default Tag Color
              </Typography>
              <HexColorPicker color={internalColor} onChange={setInternalColor} />
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Box>
  )
}
