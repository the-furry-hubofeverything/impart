import {
  Box,
  Chip,
  ChipProps,
  Fade,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  styled,
  useTheme
} from '@mui/material'
import { useRef, useState } from 'react'
import { ContextMenu } from './ContextMenu'
import EditIcon from '@mui/icons-material/Edit'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/Delete'
import { HexColorPicker } from 'react-colorful'
import CheckIcon from '@mui/icons-material/Check'

export interface TagProps {
  tag: Impart.Tag
  editable?: boolean
  selected?: boolean
  size?: ChipProps['size']
  onClick?: () => void
}

export function Tag({ tag, selected, editable, onClick, size }: TagProps) {
  const [editMode, setEditMode] = useState(false)
  const theme = useTheme()
  const [internalLabel, setInternalLabel] = useState(tag.label ?? '')
  const [internalColor, setInternalColor] = useState(tag.color ?? theme.palette.primary.main)

  const { reload } = useTagGroups()

  const edit = async () => {
    await window.tagApi.editTag(tag.id, internalLabel, internalColor)
    reload()
    setEditMode(false)
  }

  return (
    <Box position="relative">
      {editMode && (
        <Paper sx={{ bgcolor: internalColor, borderRadius: 5 }}>
          <Stack px={0.5} py={0.5} direction="row" gap={0.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Tag Name"
              value={internalLabel}
              autoFocus
              onChange={(e) => setInternalLabel(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  edit()
                }
              }}
              sx={{ width: internalLabel == '' ? 90 : internalLabel.length * 5.5 + 38 }}
              slotProps={{
                input: {
                  sx: {
                    borderRadius: 4,
                    bgcolor: 'rgb(255 255 255 / 50%)',
                    fontSize: 12,
                    height: '2em'
                  }
                }
              }}
            />
            <IconButton
              size="small"
              sx={{ width: 24, height: 24, color: theme.palette.getContrastText(internalColor) }}
              onClick={edit}
            >
              <CheckIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Paper>
      )}
      {!editMode && (
        <ContextMenu
          disabled={!editable}
          options={[
            {
              icon: <EditIcon />,
              label: 'Edit...',
              onClick: () => setEditMode(true)
            },
            {
              icon: <DeleteIcon />,
              label: 'Delete',
              onClick: async () => {
                await window.tagApi.deleteTag(tag.id)
                reload()
              },
              danger: true
            }
          ]}
          render={({ open }) => (
            <Chip
              onClick={onClick}
              size={size}
              label={tag.label ? tag.label : 'Unnamed Tag'}
              onContextMenu={open}
              sx={{
                bgcolor: tag.color ?? 'primary.main',
                color: theme.palette.getContrastText(tag.color ?? theme.palette.primary.main),
                boxShadow: selected
                  ? `0px 0px 0px 2px ${theme.palette.secondary.light}, 0px 0px 0px 5px ${theme.palette.secondary.dark}`
                  : undefined,

                '&:hover': {
                  opacity: 0.8,
                  bgcolor: tag.color ?? 'primary.main',
                  color: theme.palette.getContrastText(tag.color ?? theme.palette.primary.main)
                }
              }}
            />
          )}
        />
      )}
      <Fade in={editMode} unmountOnExit>
        <Box
          position="absolute"
          mt={1}
          left={0}
          zIndex={1}
          sx={{
            '& .react-colorful': {
              width: 150,
              height: 160
            }
          }}
        >
          <HexColorPicker color={internalColor} onChange={setInternalColor} />
        </Box>
      </Fade>
    </Box>
  )
}
