import { Box } from '@mui/material'
import React from 'react'
import { BOX_HEIGHT, BOX_WIDTH } from './TaggableDisplay'
import { useAsyncData } from '../useAsyncData'

export interface ImageDisplayProps {
  taggable: Impart.TaggableImage
}

export function ImageDisplay({ taggable }: ImageDisplayProps) {
  const { data: thumbnail, isLoading } = useAsyncData(
    () => window.imageApi.getThumbnail(taggable.id),
    [taggable]
  )

  const boxRatio = BOX_WIDTH / BOX_HEIGHT
  const aspectRatio = taggable.image.width / taggable.image.height

  const targetWidth = aspectRatio > boxRatio ? BOX_WIDTH : BOX_HEIGHT * aspectRatio
  const targetHeight = aspectRatio > boxRatio ? BOX_WIDTH / aspectRatio : BOX_HEIGHT

  return (
    <Box
      component="img"
      src={`data:image/${taggable.image.fileName.endsWith('png') ? 'png' : 'jpg'};base64,${isLoading ? taggable.pinkynail : thumbnail}`}
      borderRadius={2}
      width={targetWidth}
      height={targetHeight}
      sx={{ boxShadow: 2 }}
    />
  )
}
