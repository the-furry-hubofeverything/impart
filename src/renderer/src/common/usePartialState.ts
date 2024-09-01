import { useCallback, useState } from 'react'

export function usePartialState<T>(defaultValue: T): [T, (t: Partial<T>) => void] {
  const [state, setState] = useState(defaultValue)

  const setPartial = useCallback(
    (changes: Partial<T>) => setState((s) => ({ ...s, ...changes }) as T),
    []
  )

  return [state, setPartial]
}
