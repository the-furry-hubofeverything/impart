import React, { useEffect, useState } from 'react'

interface MemoizedWrapperProps {
  renderItem: (item: any) => React.ReactNode
  item: any
}

const MemoizedWrapper = React.memo(({ item, renderItem, getKey }: MemoizedWrapperProps) => {
  return <React.Fragment>{renderItem(item)}</React.Fragment>
})

export interface SequentialDelayedMountProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => React.Key
  initialCount?: number
  batchIncrement?: number
  delay?: number
}

export function SequentialDelayedMount<T>({
  items,
  renderItem,
  getKey,
  initialCount = 100,
  batchIncrement = 5,
  delay = 30
}: SequentialDelayedMountProps<T>) {
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
    <>
      {items
        ?.slice(0, renderCount)
        .map((i) => <MemoizedWrapper key={getKey(i)} item={i} renderItem={renderItem} />)}
    </>
  )
}
