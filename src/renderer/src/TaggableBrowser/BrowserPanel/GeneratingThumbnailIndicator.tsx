import { CircularProgress, Fade, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

export interface GeneratingThumbnailIndicatorProps {}

export function GeneratingThumbnailIndicator({}: GeneratingThumbnailIndicatorProps) {
  const [show, setShow] = useState(false)

  const genCountRef = useRef(0)

  useEffect(() => {
    return window.thumbnailApi.onBuildingThumbnail(() => {
      genCountRef.current++

      if (genCountRef.current > 0) {
        setShow(true)
      }
    })
  })

  useEffect(() => {
    return window.thumbnailApi.onThumbnailBuilt(() => {
      genCountRef.current--

      if (genCountRef.current == 0) {
        setShow(false)
      }
    })
  })

  return (
    <Fade in={show}>
      <Paper sx={{ p: 1, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, opacity: 0.8 }}>
        <Stack direction="row" gap={1} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Generating thumbnails</Typography>
        </Stack>
      </Paper>
    </Fade>
  )
}
