import { Box, IconButton } from '@mui/material'
import React from 'react'
import BackIcon from '@mui/icons-material/ArrowBackRounded'

export interface BackableProps {
  children?: React.ReactNode
  onBack?: () => void
}

export function Backable({ children, onBack }: BackableProps) {
  return (
    <Box position="relative" height="100%">
      <Box position="absolute" top={20} left={20}>
        <IconButton onClick={onBack} size="large">
          <BackIcon fontSize="inherit" />
        </IconButton>
      </Box>
      {children}
    </Box>
  )
}
