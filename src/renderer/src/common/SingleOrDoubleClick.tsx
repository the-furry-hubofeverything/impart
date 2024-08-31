import { Box, BoxProps } from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface SingleOrDoubleClickProps extends Omit<BoxProps, 'onClick'> {
  onClick?: () => void
  onDoubleClick?: () => void
  doubleClickDelay?: number
}

export function SingleOrDoubleClick({
  onClick,
  onDoubleClick,
  doubleClickDelay = 150,
  ...boxProps
}: SingleOrDoubleClickProps) {
  const [awaitingDoubleClick, setAwaitingDoubleClick] = useState(false)

  const click = () => {
    if (awaitingDoubleClick) {
      onDoubleClick && onDoubleClick()
      setAwaitingDoubleClick(false)
    } else {
      setAwaitingDoubleClick(true)
    }
  }

  useEffect(() => {
    if (awaitingDoubleClick) {
      const timer = setTimeout(() => {
        onClick && onClick()
        setAwaitingDoubleClick(false)
      }, doubleClickDelay)

      return () => clearTimeout(timer)
    }
  }, [awaitingDoubleClick, doubleClickDelay, onClick])

  return <Box width="100%" height="100%" {...boxProps} onClick={click} />
}
