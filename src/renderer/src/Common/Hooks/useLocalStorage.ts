import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, defaultValue: T): [T, (state: T) => void]
function useLocalStorage<T = undefined>(
  key: string,
  defaultValue?: T
): [T | undefined, (state: T | undefined) => void]
function useLocalStorage<T = undefined>(
  key: string,
  defaultValue?: T
): [T | undefined, (state: T | undefined) => void] {
  const [value, setValue] = useState(() => {
    let currentValue: T | undefined

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue))
    } catch (error) {
      currentValue = defaultValue
    }

    return currentValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}

export { useLocalStorage }
