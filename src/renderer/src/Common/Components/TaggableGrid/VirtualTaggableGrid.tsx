import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'
import { BOX_WIDTH } from '../TaggableDisplay/TaggableDisplay'
import { useEditTaggable } from '@renderer/TaggableBrowser/EditTaggableProvider'
import { useScrollLock } from '../../Hooks/useScrollLock'
import { TaggableWrapper, TaggableWrapperProps } from './TaggableWrapper'
import { emptyImages } from './EmptyImages'

function getRandomEmptyImage() {
  return emptyImages[Math.floor(Math.random() * emptyImages.length)]
}

const gridComponents: GridComponents = {
  List: forwardRef(({ children, ...props }, ref) => (
    <Grid container {...props} ref={ref}>
      {children}
    </Grid>
  )),
  Item: forwardRef(({ children, ...props }, ref) => (
    <Grid minWidth={BOX_WIDTH + 28} {...props} ref={ref} size={{ xs: 'grow' }}>
      {children}
    </Grid>
  ))
}

export interface VirtualTaggableGridProps extends Omit<TaggableWrapperProps, 'taggable'> {
  taggables?: Impart.Taggable[]
}

export function VirtualTaggableGrid({ taggables, ...wrapperProps }: VirtualTaggableGridProps) {
  if (!taggables) {
    return null
  }

  const [emptyImage, setEmptyImage] = useState(getRandomEmptyImage())

  useEffect(() => {
    //To prevent flickering, we only change the image if there ARE taggables
    // rather than if there aren't
    if (taggables.length > 0) {
      setEmptyImage(getRandomEmptyImage())
    }
  }, [taggables])

  const editState = useEditTaggable()
  const handleScroll = useScrollLock(editState && editState.editTarget != null)

  if (taggables.length === 0) {
    return (
      <Stack width="100%" height="100%" alignItems="center" justifyContent="center" gap={0}>
        <img src={emptyImage} height={400} />
        <Typography color="primary.main" fontSize={36}>
          No Items Found
        </Typography>
      </Stack>
    )
  }

  return (
    <VirtuosoGrid
      data={taggables}
      totalCount={taggables.length}
      components={gridComponents}
      onScroll={handleScroll}
      computeItemKey={(index, item) => item.id}
      itemContent={(index, f) => (
        <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
          <TaggableWrapper taggable={f} {...wrapperProps} />
        </Stack>
      )}
    />
  )
}
