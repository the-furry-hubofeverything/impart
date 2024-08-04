import { Box, Stack, Typography } from '@mui/material'
import { useAsyncData } from './useAsyncData'

const BOX_WIDTH = 220
const BOX_HEIGHT = 190

export interface ImageDisplayProps {
  image: Impart.TaggableImage
  isSelected?: boolean
  onClick?: (mods: { ctrl: boolean; shift: boolean }) => void
  onRightClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function ImageDisplay({
  image: taggableImage,
  onClick,
  onRightClick,
  isSelected
}: ImageDisplayProps) {
  const { data: image, isLoading } = useAsyncData(
    () => window.imageApi.getThumbnail(taggableImage.id),
    []
  )

  const boxRatio = BOX_WIDTH / BOX_HEIGHT
  const imageRatio = taggableImage.width / taggableImage.height

  const targetWidth = imageRatio > boxRatio ? BOX_WIDTH : BOX_HEIGHT * imageRatio
  const targetHeight = imageRatio > boxRatio ? BOX_WIDTH / imageRatio : BOX_HEIGHT

  return (
    <Stack
      onContextMenu={(e) => {
        onRightClick && onRightClick(e)
      }}
      alignItems="center"
      justifyContent="center"
      height="100%"
      width={BOX_WIDTH + 20}
      p={1}
      borderRadius={2}
      sx={{
        userSelect: 'none',
        bgcolor: isSelected ? '#FFFFFF55' : undefined,
        '&:hover': {
          bgcolor: isSelected ? '#FFFFFF55' : '#FFFFFF33'
        }
      }}
      onClick={(e) => onClick && onClick({ ctrl: e.ctrlKey, shift: e.shiftKey })}
      onDoubleClick={() => window.fileApi.openFile(taggableImage.id)}
    >
      <Box
        component="img"
        src={`data:image/${taggableImage.fileName.endsWith('png') ? 'png' : 'jpg'};base64,${isLoading ? taggableImage.pinkynail : image}`}
        borderRadius={2}
        width={targetWidth}
        height={targetHeight}
        sx={{ boxShadow: 2 }}
      />
      <Box maxWidth={BOX_WIDTH} pt={0.25}>
        <Typography textAlign="center" variant="caption" sx={{ wordBreak: 'break-all' }}>
          {taggableImage.fileName}
        </Typography>
      </Box>
    </Stack>
  )
}
