import { Box, Stack, Typography } from '@mui/material'
import { isTaggableFile, isTaggableImage, isTaggableStack } from '../taggable'
import { ImageDisplay } from './ImageDisplay'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import React from 'react'
import BurstModeIcon from '@mui/icons-material/BurstMode'

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
      width={BOX_WIDTH + 20}
      height={BOX_HEIGHT + 40}
      p={1}
      borderRadius={2}
      sx={{
        userSelect: 'none',
        bgcolor: isSelected ? '#FFFFFF55' : undefined,
        '&:hover': {
          bgcolor: isSelected ? '#FFFFFF55' : '#FFFFFF33'
        }
      }}
      onDoubleClick={() => !isTaggableStack(taggable) && window.fileApi.openFile(taggable.id)}
    >
      {isTaggableImage(taggable) && <ImageDisplay image={taggable} />}
      {isTaggableFile(taggable) && (
        <Stack width={BOX_WIDTH} px={2} alignItems="center" justifyContent="center">
          <InsertDriveFileIcon sx={{ fontSize: 120 }} />
        </Stack>
      )}
      {isTaggableStack(taggable) &&
        (taggable.cover ? (
          <Box mt={2} ml={2}>
            <Box
              p={0.1}
              bgcolor="background.paper"
              borderRadius={2}
              sx={{
                boxShadow: 2
              }}
            >
              <Box
                p={0.1}
                ml={-1}
                mt={-1}
                mr={1}
                mb={1}
                bgcolor="background.paper"
                borderRadius={2}
                sx={{
                  boxShadow: 2
                }}
              >
                <Box ml={-1} mt={-1} mr={1} mb={1}>
                  <ImageDisplay image={taggable.cover} shrink />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Stack width={BOX_WIDTH} px={2} alignItems="center" justifyContent="center">
            <BurstModeIcon sx={{ fontSize: 120 }} />
          </Stack>
        ))}
      <Box maxWidth={BOX_WIDTH} pt={0.25}>
        <Typography textAlign="center" variant="caption" sx={{ wordBreak: 'break-all' }}>
          {!isTaggableStack(taggable) && taggable.fileIndex.fileName}
          {isTaggableStack(taggable) && taggable.name}
        </Typography>
      </Box>
    </Stack>
  )
})
