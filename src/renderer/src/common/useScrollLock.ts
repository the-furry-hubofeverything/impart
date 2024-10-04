import { useCallback, useEffect, useState } from 'react'

export function useScrollLock(lock: boolean) {
  const [scrollPosition, setScrollPosition] = useState(0)

  return useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const newScrollPosition = e.currentTarget.scrollTop

      if (!lock) {
        setScrollPosition(newScrollPosition)
      }
      if (lock) {
        e.currentTarget.scrollTo({
          top: scrollPosition,
          left: 0
        })
      }
    },
    [scrollPosition, lock]
  )
}
