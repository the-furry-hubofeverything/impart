import { Box, Grid2 as Grid } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
import React from 'react'

export interface CommonTaggableGridProps {
  taggables?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  onSelect?: (item: Impart.Taggable, add: boolean, range: boolean) => void
  onRightClick?: (item: Impart.Taggable, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export interface TaggableGridProps extends CommonTaggableGridProps {}

export const TaggableGrid = React.memo(function ({
  taggables,
  selection,
  onSelect,
  onRightClick
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
            onRightClick && onRightClick(f, e)
          }}
          onClick={(e) => onSelect && onSelect(f, e.ctrlKey, e.shiftKey)}
        >
          <TaggableDisplay taggable={f} isSelected={selection?.some((s) => s.id === f.id)} />
        </Grid>
      ))}
    </Grid>
  )
})
