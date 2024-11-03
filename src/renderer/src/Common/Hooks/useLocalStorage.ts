import { useState, useEffect } from 'react'

function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>]
function useLocalStorage<T = undefined>(
  key: string,
  defaultValue?: T
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]
function useLocalStorage<T = undefined>(
  key: string,
  defaultValue?: T
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] {
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
