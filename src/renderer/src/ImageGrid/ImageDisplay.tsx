import { Box, Menu, MenuItem, Skeleton, Stack, Typography } from '@mui/material'
import { useAsyncData } from '../common/useAsyncData'
import { useState } from 'react'
import { useContextMenu } from '@renderer/common/useContextMenu'

const BOX_WIDTH = 240
const BOX_HEIGHT = 200

export interface ImageDisplayProps {
  image: Impart.TaggableImage
}

export function ImageDisplay({ image: taggableImage }: ImageDisplayProps) {
  const { anchorPosition, handleContextMenu, closeMenu, open: menuOpen } = useContextMenu()

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
      onContextMenu={handleContextMenu}
      alignItems="center"
      justifyContent="center"
      height="100%"
      width={250}
    >
      <Box
        component="img"
        src={`data:image/${taggableImage.fileName.endsWith('png') ? 'png' : 'jpg'};base64,${isLoading ? taggableImage.pinkynail : image}`}
        borderRadius={2}
        width={targetWidth}
        height={targetHeight}
        onDoubleClick={() => window.fileApi.openFile(taggableImage.id)}
      />
      <Box maxWidth={BOX_WIDTH}>
        <Typography textAlign="center" variant="caption" sx={{ wordBreak: 'break-all' }}>
          {taggableImage.fileName}
        </Typography>
      </Box>
      <Menu
        open={menuOpen}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
      >
        <MenuItem
          onClick={() => {
            window.fileApi.openFile(taggableImage.id)
            closeMenu()
          }}
        >
          Open
        </MenuItem>
      </Menu>
    </Stack>
  )
}
