import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { createContext, useContext, useEffect, useState } from 'react'

export interface DirectoryData {
  directories: ReturnType<typeof useImpartIpcData<Impart.CountedDirectory[]>>
  startingUp: boolean
}

const DirectoryContext = createContext<DirectoryData | null>(null)

export interface DirectoryProviderProps {
  children?: React.ReactNode
}

export function DirectoryProvider({ children }: DirectoryProviderProps) {
  const [startingUp, setStartingUp] = useState(true)
  const directories = useImpartIpcData(() => window.indexApi.getDirectories(), [])

  useEffect(() => {
    if (!directories.isLoading && startingUp) {
      setStartingUp(false)
    }
  }, [directories.isLoading, startingUp])

  return (
    <DirectoryContext.Provider value={{ directories, startingUp }}>
      {children}
    </DirectoryContext.Provider>
  )
}

export function useDirectories() {
  const result = useContext(DirectoryContext)

  if (!result) {
    throw new Error('useDirectory() cannot be used without being wrapped by a DirectoryProvider')
  }

  return { ...result.directories, startingUp: result.startingUp }
}
