import { Grid2 as Grid } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
import React from 'react'

export interface TaggableGridProps {
  taggables?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  onSelect?: (item: Impart.Taggable, add: boolean, range: boolean) => void
  onRightClick?: (item: Impart.Taggable, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

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
        <Grid key={f.id} minWidth={BOX_WIDTH + 26} size={{ xs: 'grow' }}>
          <TaggableDisplay
            taggable={f}
            isSelected={selection?.some((s) => s.id === f.id)}
            onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
            onRightClick={(e) => onRightClick && onRightClick(f, e)}
          />
        </Grid>
      ))}
    </Grid>
  )
})
