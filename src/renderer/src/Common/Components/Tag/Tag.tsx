import { Box, Chip, ChipProps, useTheme } from '@mui/material'
import { useState } from 'react'
import { ContextMenu } from '../ContextMenu'
import EditIcon from '@mui/icons-material/EditRounded'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import { TagEditor } from './TagEditor'

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

  const { reload } = useTagGroups()

  return (
    <Box position="relative">
      <TagEditor tag={tag} show={editMode} onEdit={reload} onClose={() => setEditMode(false)} />
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
    </Box>
  )
}
