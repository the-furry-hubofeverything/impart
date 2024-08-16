import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TagManager, TagState } from './tagManager'

interface TagData extends TagState {
  ready: boolean
}

const TagContext = createContext<TagData | null>(null)

export interface TagProviderProps {
  children?: React.ReactNode
}

export function TagProvider({ children }: TagProviderProps) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<TagState>(TagManager.getInitialState())
  const fileManagerRef = useRef<TagManager>()

  useEffect(() => {
    fileManagerRef.current = new TagManager()
    fileManagerRef.current.setOnChange(setState)
    setReady(true)

    fileManagerRef.current.loadGroups()

    return () => {
      fileManagerRef.current = undefined
      setReady(false)
    }
  }, [])

  return <TagContext.Provider value={{ ...state, ready }}>{children}</TagContext.Provider>
}

export function useTagGroups() {
  const result = useContext(TagContext)

  if (!result) {
    throw new Error(
      'useTaggableIndexStatus() cannot be used without being wrapped by a TaggableIndexStatusProvider'
    )
  }

  return result
}
