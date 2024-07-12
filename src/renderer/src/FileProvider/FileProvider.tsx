import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FileManager, FileState } from './fileManager'

interface FileData extends FileState {
  ready: boolean
  fetchAllFiles: () => Promise<void> | undefined
}

const FileContext = createContext<FileData | null>(null)

export interface FileProviderProps {
  children?: React.ReactNode
}

export function FileProvider({ children }: FileProviderProps) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<FileState>(FileManager.getInitialState())
  const fileManagerRef = useRef<FileManager>()

  useEffect(() => {
    fileManagerRef.current = new FileManager()
    fileManagerRef.current.setOnChange(setState)
    setReady(true)

    return () => {
      fileManagerRef.current?.destroy()
      fileManagerRef.current = undefined
      setReady(false)
    }
  }, [])

  const fetchAllFiles = useCallback(() => fileManagerRef.current?.fetchAll(), [fileManagerRef])

  return (
    <FileContext.Provider value={{ ...state, ready, fetchAllFiles }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFiles() {
  const result = useContext(FileContext)

  if (!result) {
    throw new Error(
      'useFileIndexStatus() cannot be used without being wrapped by a FileIndexStatusProvider'
    )
  }

  return result
}
