import { Box, styled } from '@mui/material'
import { alpha, BoxProps } from '@mui/system'

export const DropIndicator = styled(Box, { shouldForwardProp: (prop) => prop !== 'show' })<
  BoxProps & { show?: boolean }
>(({ theme, show }) =>
  show
    ? {
        border: `1px solid ${theme.palette.info.main}`,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.info.light, 0.2),
        margin: '-1px'
      }
    : {}
)
