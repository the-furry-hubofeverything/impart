import { Box, Stack, Typography } from '@mui/material'
import { isTaggableFile, isTaggableImage, isTaggableStack } from '../taggable'
import { ImageDisplay } from './ImageDisplay'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import React from 'react'

export const BOX_WIDTH = 220
export const BOX_HEIGHT = 190

export interface TaggableDisplayProps {
  taggable: Impart.Taggable
  isSelected?: boolean
}

export const TaggableDisplay = React.memo(function ({
  taggable,
  isSelected
}: TaggableDisplayProps) {
  return (
    <Stack
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
      onDoubleClick={() => window.fileApi.openFile(taggable.id)}
    >
      {isTaggableImage(taggable) && <ImageDisplay image={taggable} />}
      {isTaggableFile(taggable) && (
        <Stack width={BOX_WIDTH} px={2} alignItems="center" justifyContent="center">
          <InsertDriveFileIcon sx={{ fontSize: 120 }} />
        </Stack>
      )}
      <Box maxWidth={BOX_WIDTH} pt={0.25}>
        <Typography textAlign="center" variant="caption" sx={{ wordBreak: 'break-all' }}>
          {!isTaggableStack(taggable) && taggable.fileIndex.fileName}
        </Typography>
      </Box>
    </Stack>
  )
})
