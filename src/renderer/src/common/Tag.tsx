import { Chip } from '@mui/material'
import React from 'react'

export interface TagProps {
  tag: Impart.Tag
  selected?: boolean
  onClick?: () => void
}

export function Tag({ tag, selected, onClick }: TagProps) {
  return (
    <Chip
      label={tag.label}
      onClick={() => onClick && onClick()}
      sx={(theme) => ({
        bgcolor: tag.color,
        color: tag.color ? theme.palette.getContrastText(tag.color) : undefined,
        boxShadow: selected
          ? `0px 0px 0px 2px ${theme.palette.secondary.light}, 0px 0px 0px 5px ${theme.palette.secondary.dark}`
          : undefined,

        '&:hover': {
          opacity: 0.8,
          bgcolor: tag.color,
          color: tag.color ? theme.palette.getContrastText(tag.color) : undefined
        }
      })}
    />
  )
}
