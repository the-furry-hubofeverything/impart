import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { ImageDisplay } from '../common/ImageDisplay'
import { useAsyncData } from '../common/useAsyncData'
import { useFiles } from '../FileProvider/FileProvider'
import { useMultiSelection } from '@renderer/common/useMultiSelection'

export interface ImageGridProps {
  files?: Impart.TaggableImage[]
  selection?: Impart.TaggableImage[]
  onSelect?: (item: Impart.TaggableImage, add: boolean, range: boolean) => void
  onRightClick?: (
    item: Impart.TaggableImage,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void
}

export function ImageGrid({ files, selection, onSelect, onRightClick }: ImageGridProps) {
  if (!files) {
    return null
  }

  return (
    <Grid container spacing={1}>
      {files?.map((f) => (
        <Grid item key={f.id} xs={true}>
          <ImageDisplay
            image={f}
            isSelected={selection?.some((s) => s.id === f.id)}
            onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
            onRightClick={(e) => onRightClick && onRightClick(f, e)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
