import { Box, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useAsyncData } from '../common/useAsyncData'
import { useContextMenu } from '@renderer/common/useContextMenu'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import TagIcon from '@mui/icons-material/LocalOffer'

const BOX_WIDTH = 220
const BOX_HEIGHT = 190

export interface ImageDisplayProps {
  image: Impart.TaggableImage
  onClick?: (mods: { ctrl: boolean; shift: boolean }) => void
  isSelected?: boolean
}

export function ImageDisplay({ image: taggableImage, onClick, isSelected }: ImageDisplayProps) {
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
          <ListItemIcon>
            <FileOpenIcon />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu()
          }}
        >
          <ListItemIcon>
            <TagIcon />
          </ListItemIcon>
          <ListItemText>Edit Tags</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  )
}
