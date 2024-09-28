import { Grid2 as Grid, Stack } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
import React, { useMemo } from 'react'
import { DirectoryGroup } from './DirectoryGroup'
import { GroupedTaggables } from './buildTaggableGroups'
import { CommonTaggableGridProps } from './TaggableGrid'

export interface TaggableGridProps extends Omit<CommonTaggableGridProps, 'taggables'> {
  groups?: GroupedTaggables
}

export const GroupedTaggableGrid = React.memo(function ({
  groups,
  selection,
  onSelect,
  onRightClick
}: TaggableGridProps) {
  if (!groups) {
    return null
  }

  return (
    <Stack gap={2}>
      {groups.map((g) => (
        <DirectoryGroup
          key={g.directory}
          taggables={g.taggables}
          selection={selection}
          directory={g.directory}
          onSelect={onSelect}
          onRightClick={onRightClick}
        />
      ))}
    </Stack>
  )
})
