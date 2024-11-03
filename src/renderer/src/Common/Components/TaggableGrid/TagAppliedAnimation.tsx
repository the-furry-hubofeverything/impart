import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SellIcon from '@mui/icons-material/Sell'

export interface TagAppliedAnimationProps {
  show: boolean
  children: React.ReactNode
  onHide?: () => void
}

export function TagAppliedAnimation({ show, children, onHide }: TagAppliedAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => onHide && onHide(), 3000)

    return () => clearTimeout(timer)
  }, [show, onHide])

  return (
    <Box position="relative">
      {children}
      {show && (
        <>
          <Stack
            position="absolute"
            top={0}
            right={0}
            left={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            zIndex={2}
          >
            <Box className="animate__animated animate__bounceIn">
              <Box className="animate__animated animate__delay-2s animate__fadeOut">
                <Stack
                  bgcolor="background.paper"
                  width={60}
                  height={60}
                  borderRadius={50}
                  justifyContent="center"
                  alignItems="center"
                  pt={0.5}
                  pl={0.5}
                >
                  <SellIcon color="primary" sx={{ fontSize: 56 }} />
                </Stack>
              </Box>
            </Box>
          </Stack>
        </>
      )}
    </Box>
  )
}
