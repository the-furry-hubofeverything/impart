import { Box } from '@mui/material'
import { BOX_HEIGHT, BOX_WIDTH } from './TaggableDisplay'

export interface ImageDisplayProps {
  image: Impart.TaggableImage
  shrink?: boolean
}

const SHRINK_SCALE = 0.92

export function ImageDisplay({ image, shrink }: ImageDisplayProps) {
  const boxRatio = BOX_WIDTH / BOX_HEIGHT
  const aspectRatio = image.dimensions.width / image.dimensions.height

  const targetWidth =
    (aspectRatio > boxRatio ? BOX_WIDTH : BOX_HEIGHT * aspectRatio) * (shrink ? SHRINK_SCALE : 1)
  const targetHeight =
    (aspectRatio > boxRatio ? BOX_WIDTH / aspectRatio : BOX_HEIGHT) * (shrink ? SHRINK_SCALE : 1)

  return (
    <Box
      component={'img'}
      src={`thum:///${image.id}`}
      alt={image.fileIndex.fileName}
      borderRadius={2}
      width={targetWidth}
      height={targetHeight}
      sx={{ boxShadow: 2, verticalAlign: 'bottom' }}
    />
  )
}
