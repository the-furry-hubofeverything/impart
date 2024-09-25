import { Box } from '@mui/material'
import { BOX_HEIGHT, BOX_WIDTH } from './TaggableDisplay'

export interface ImageDisplayProps {
  image: Impart.TaggableImage
}

export function ImageDisplay({ image }: ImageDisplayProps) {
  const boxRatio = BOX_WIDTH / BOX_HEIGHT
  const aspectRatio = image.dimensions.width / image.dimensions.height

  const targetWidth = aspectRatio > boxRatio ? BOX_WIDTH : BOX_HEIGHT * aspectRatio
  const targetHeight = aspectRatio > boxRatio ? BOX_WIDTH / aspectRatio : BOX_HEIGHT

  return (
    <Box
      component={'img'}
      //The loading attr NEEDS to go before the src, otherwise chromium
      // immediately sprints to downloading the image before it reads
      // the rest of the attributes
      loading="lazy"
      src={`thum:///${image.fileIndex.path}`}
      alt={image.fileIndex.fileName}
      borderRadius={2}
      width={targetWidth}
      height={targetHeight}
      sx={{ boxShadow: 2 }}
    />
  )
}
