import { Box, Grid } from '@mui/material'
import { ImageDisplay } from '../common/ImageDisplay'
import { isTaggableFile, isTaggableImage } from '@renderer/common/taggable'

export interface ImageGridProps {
  files?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  onSelect?: (item: Impart.Taggable, add: boolean, range: boolean) => void
  onRightClick?: (item: Impart.Taggable, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function ImageGrid({ files, selection, onSelect, onRightClick }: ImageGridProps) {
  if (!files) {
    return null
  }

  return (
    <Grid container spacing={1}>
      {files?.map((f) => (
        <Grid item key={f.id} xs={true}>
          {isTaggableImage(f) && (
            <ImageDisplay
              image={f}
              isSelected={selection?.some((s) => s.id === f.id)}
              onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
              onRightClick={(e) => onRightClick && onRightClick(f, e)}
            />
          )}
          {isTaggableFile(f) && (
            <Box width={240} height={190}>
              Hi
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  )
}
