import { Box, Grid2 as Grid } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
import React from 'react'

export interface CommonTaggableGridProps {
  taggables?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  onSelect?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onRightClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onDoubleClick?: (item: Impart.Taggable) => void
}

export interface TaggableGridProps extends CommonTaggableGridProps {}

export const TaggableGrid = React.memo(function ({
  taggables,
  selection,
  onSelect,
  onRightClick,
  onDoubleClick
}: TaggableGridProps) {
  if (!taggables) {
    return null
  }

  return (
    <Grid container spacing={1}>
      {taggables?.map((f) => (
        <Grid
          key={f.id}
          minWidth={BOX_WIDTH + 26}
          size={{ xs: 'grow' }}
          onContextMenu={(e) => {
            onRightClick && onRightClick(e, f)
          }}
          onClick={(e) => onSelect && onSelect(e, f)}
          onDoubleClick={() => onDoubleClick && onDoubleClick(f)}
        >
          <TaggableDisplay taggable={f} isSelected={selection?.some((s) => s.id === f.id)} />
        </Grid>
      ))}
    </Grid>
  )
})
