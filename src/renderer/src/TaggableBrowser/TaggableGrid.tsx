import { Grid } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
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
        <Grid item key={f.id} xs={true}>
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
