import { DependencyList, useEffect, useState } from 'react'

export function useDebounceEffect(func: () => void, delay: number, deps: DependencyList) {
  useEffect(() => {
    const timer = setTimeout(func, delay)
    return () => clearTimeout(timer)
  }, [delay, ...deps /* No func here! */])
}
