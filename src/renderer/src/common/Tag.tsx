import { Box, Chip, Paper, TextField, styled } from '@mui/material'
import { useState } from 'react'
import { ContextMenu } from './ContextMenu'
import EditIcon from '@mui/icons-material/Edit'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/Delete'

export interface TagProps {
  tag: Impart.Tag
  selected?: boolean
  onClick?: () => void
}

export function Tag({ tag, selected, onClick }: TagProps) {
  const [editMode, setEditMode] = useState(false)
  const [internalLabel, setInternalLabel] = useState(tag.label ?? '')

  const { editTag, deleteTag } = useTagGroups()

  const edit = async () => {
    await editTag(tag.id, internalLabel, tag.color)
    setEditMode(false)
  }

  if (editMode) {
    return (
      <Paper sx={{ bgcolor: tag.color ?? 'primary.main', borderRadius: 5 }}>
        <Box px={0.5} py={0.5}>
          <TextField
            size="small"
            placeholder="Tag Name"
            value={internalLabel}
            autoFocus
            onChange={(e) => setInternalLabel(e.currentTarget.value)}
            onBlur={edit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                edit()
              }
            }}
            sx={{ width: internalLabel == '' ? 90 : internalLabel.length * 5.5 + 38 }}
            InputProps={{
              sx: {
                borderRadius: 4,
                bgcolor: 'rgb(255 255 255 / 50%)',
                fontSize: 12,
                height: '2em'
              }
            }}
          />
        </Box>
      </Paper>
    )
  }

  return (
    <ContextMenu
      options={[
        {
          icon: <EditIcon />,
          label: 'Edit...',
          onClick: () => setEditMode(true)
        },
        {
          icon: <DeleteIcon />,
          label: 'Delete',
          onClick: () => deleteTag(tag.id),
          danger: true
        }
      ]}
    >
      <Chip
        onClick={onClick}
        label={tag.label ? tag.label : 'Unnamed Tag'}
        sx={(theme) => ({
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
        })}
      />
    </ContextMenu>
  )
}
