import { Box } from '@mui/material'
import React from 'react'
import { BOX_HEIGHT, BOX_WIDTH } from './TaggableDisplay'
import { useAsyncData } from '../useAsyncData'

export interface ImageDisplayProps {
  image: Impart.TaggableImage
}

export function ImageDisplay({ image }: ImageDisplayProps) {
  const { data: thumbnail, isLoading } = useAsyncData(
    () => window.fileApi.getThumbnail(image.id),
    [image]
  )

  const boxRatio = BOX_WIDTH / BOX_HEIGHT
  const aspectRatio = image.dimensions.width / image.dimensions.height

  const targetWidth = aspectRatio > boxRatio ? BOX_WIDTH : BOX_HEIGHT * aspectRatio
  const targetHeight = aspectRatio > boxRatio ? BOX_WIDTH / aspectRatio : BOX_HEIGHT

  return (
    <Box
      component="img"
      src={`thum:///${image.fileIndex.path}`}
      borderRadius={2}
      width={targetWidth}
      height={targetHeight}
      sx={{ boxShadow: 2 }}
    />
  )
}
