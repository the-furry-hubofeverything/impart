import { Grid } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { SequentialDelayedMountGrid } from '@renderer/common/SequentialDelayedMountGrid'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_HEIGHT, BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
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
    <SequentialDelayedMountGrid
      items={taggables}
      getKey={(t) => t.id}
      minItemWidth={BOX_WIDTH + 26}
      averageItemHeight={BOX_HEIGHT + 20}
      initialCount={40}
      batchIncrement={10}
      renderItem={(f) => (
        <TaggableDisplay
          taggable={f}
          isSelected={selection?.some((s) => s.id === f.id)}
          onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
          onRightClick={(e) => onRightClick && onRightClick(f, e)}
        />
      )}
    />
  )
})
