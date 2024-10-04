import { Box } from '@mui/material'
import React from 'react'

export interface PaperStackProps {
  children?: React.ReactNode
}

export function PaperStack({ children }: PaperStackProps) {
  return (
    <Box mt={2} ml={2}>
      <Box
        p={0.1}
        bgcolor="background.paper"
        borderRadius={2}
        sx={{
          boxShadow: 2
        }}
      >
        <Box
          p={0.1}
          ml={-1}
          mt={-1}
          mr={1}
          mb={1}
          bgcolor="background.paper"
          borderRadius={2}
          sx={{
            boxShadow: 2
          }}
        >
          <Box ml={-1} mt={-1} mr={1} mb={1}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
