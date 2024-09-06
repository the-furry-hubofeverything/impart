import { Box, Grid, GridProps } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

function calculateExtraHeight(
  columnCount: number,
  averageItemHeight: number,
  remainingItems: number
) {
  return Math.max(0, (remainingItems / columnCount) * averageItemHeight)
}

interface MemoizedGridItemProps {
  renderItem: (item: any) => React.ReactNode
  item: any
}

const MemoizedGridItem = React.memo(({ item, renderItem }: MemoizedGridItemProps) => {
  return (
    <Grid item xs={true}>
      {renderItem(item)}
    </Grid>
  )
})

export interface SequentialDelayedMountGridProps<T> extends GridProps {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => React.Key
  minItemWidth: number
  averageItemHeight: number
  initialCount?: number
  batchIncrement?: number
  delay?: number
}

export function SequentialDelayedMountGrid<T>({
  items,
  renderItem,
  getKey,
  minItemWidth,
  averageItemHeight,
  initialCount = 100,
  batchIncrement = 5,
  delay = 30,
  ...gridProps
}: SequentialDelayedMountGridProps<T>) {
  const [renderCount, setRenderCount] = useState(initialCount)

  useEffect(() => {
    setRenderCount(initialCount)
  }, [items, initialCount])

  useEffect(() => {
    if (renderCount < (items?.length ?? 0)) {
      setTimeout(() => setRenderCount(renderCount + batchIncrement), delay)
    }
  }, [renderCount, items, delay, batchIncrement])

  return (
    <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ width }) => (
        <>
          <Grid container {...gridProps}>
            {items
              ?.slice(0, renderCount)
              .map((i) => <MemoizedGridItem key={getKey(i)} item={i} renderItem={renderItem} />)}
          </Grid>
          <Box
            height={calculateExtraHeight(
              Math.floor(width / minItemWidth),
              averageItemHeight,
              (items.length ?? 0) - renderCount
            )}
          ></Box>
        </>
      )}
    </AutoSizer>
  )
}
