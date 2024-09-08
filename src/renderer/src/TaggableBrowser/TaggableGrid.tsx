import { Box, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
import React, { useMemo } from 'react'

type DirectoryMap = { directory: string; taggables: Impart.Taggable[] }[]

function buildMap(taggables: Impart.Taggable[]) {
  const groups: DirectoryMap = []

  taggables.forEach((t) => {
    const group = groups.find((g) => g.directory === t.directory)

    if (group) {
      group.taggables.push(t)
    } else {
      groups.push({
        directory: t.directory,
        taggables: [t]
      })
    }
  })

  return groups
}

export interface TaggableGridProps {
  taggables?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  groupByDirectory?: boolean
  onSelect?: (item: Impart.Taggable, add: boolean, range: boolean) => void
  onRightClick?: (item: Impart.Taggable, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const TaggableGrid = React.memo(function ({
  taggables,
  selection,
  groupByDirectory,
  onSelect,
  onRightClick
}: TaggableGridProps) {
  if (!taggables) {
    return null
  }

  const directoryGroups = useMemo(() => buildMap(taggables), [taggables])

  if (groupByDirectory) {
    return (
      <Stack gap={2}>
        {directoryGroups.map((g) => (
          <Box key={g.directory}>
            <Box position="sticky" top={80}>
              <Paper sx={{ p: 1, mx: 1 }}>
                <Typography variant="h5">{g.directory}</Typography>
              </Paper>
            </Box>
            <Grid container spacing={1}>
              {g.taggables?.map((f) => (
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
          </Box>
        ))}
      </Stack>
    )
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
