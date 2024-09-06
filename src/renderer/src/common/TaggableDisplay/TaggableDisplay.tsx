import { Box, Stack, Typography } from '@mui/material'
import { isTaggableFile, isTaggableImage } from '../taggable'
import { ImageDisplay } from './ImageDisplay'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

export const BOX_WIDTH = 220
export const BOX_HEIGHT = 190

export interface TaggableDisplayProps {
  taggable: Impart.Taggable
  isSelected?: boolean
  onClick?: (mods: { ctrl: boolean; shift: boolean }) => void
  onRightClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function TaggableDisplay({
  taggable,
  onClick,
  onRightClick,
  isSelected
}: TaggableDisplayProps) {
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
      onClick={(e) => {
        onClick && onClick({ ctrl: e.ctrlKey, shift: e.shiftKey })
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
          {taggable.fileIndex.fileName}
        </Typography>
      </Box>
    </Stack>
  )
}
