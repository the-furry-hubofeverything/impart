import { createContext, useContext, useEffect, useState } from 'react'

export interface FileIndexStatusData {
  isIndexing: boolean
  filesIndexed: number
  total: number
}

const FileIndexStatusContext = createContext<FileIndexStatusData | null>(null)

export interface FileIndexStatusProviderProps {
  indexingTimeout?: number
  children?: React.ReactNode
}

export function FileIndexStatusProvider({
  children,
  indexingTimeout = 3000
}: FileIndexStatusProviderProps) {
  const [isIndexing, setIndexing] = useState(false)
  const [filesIndexed, setFilesIndexed] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    window.fileApi.onFileIndexed((e) => {
      setIndexing(true)
      setFilesIndexed(e.amountIndexed)
      setTotal(e.total)
    })
  }, [])

  useEffect(() => {
    if (isIndexing) {
      const timeout = setTimeout(() => setIndexing(false), indexingTimeout)

      return () => clearTimeout(timeout)
    }
  }, [isIndexing, indexingTimeout])

  return (
    <FileIndexStatusContext.Provider value={{ isIndexing, filesIndexed, total }}>
      {children}
    </FileIndexStatusContext.Provider>
  )
}

export function useFileIndexStatus() {
  const result = useContext(FileIndexStatusContext)

  if (!result) {
    throw new Error(
      'useFileIndexStatus() cannot be used without being wrapped by a FileIndexStatusProvider'
    )
  }

  return result
}
