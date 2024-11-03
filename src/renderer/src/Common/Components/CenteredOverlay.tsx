import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'

export interface CenteredOverlayProps {
  overlay: React.ReactNode
  show: boolean
  onHide?: () => void
  autoHideDelay?: number
  children: React.ReactNode
}

export function CenteredOverlay({
  overlay,
  show,
  onHide,
  autoHideDelay,
  children
}: CenteredOverlayProps) {
  useEffect(() => {
    if (show && autoHideDelay) {
      const timer = setTimeout(() => onHide && onHide(), autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [show, onHide, autoHideDelay])

  return (
    <Box position="relative">
      {children}
      {show && (
        <Stack
          position="absolute"
          top={0}
          right={0}
          left={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
          zIndex={2}
          sx={{ pointerEvents: 'none' }}
        >
          {overlay}
        </Stack>
      )}
    </Box>
  )
}
