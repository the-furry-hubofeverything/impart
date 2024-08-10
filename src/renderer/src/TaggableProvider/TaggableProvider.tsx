import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TaggableManager, TaggableState } from './taggableManager'

interface TaggableData extends TaggableState {
  ready: boolean
  fetchAllTaggables: (tagIds?: number[]) => Promise<void> | undefined
}

const TaggableContext = createContext<TaggableData | null>(null)

export interface TaggableProviderProps {
  children?: React.ReactNode
}

export function TaggableProvider({ children }: TaggableProviderProps) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<TaggableState>(TaggableManager.getInitialState())
  const fileManagerRef = useRef<TaggableManager>()

  useEffect(() => {
    fileManagerRef.current = new TaggableManager()
    fileManagerRef.current.setOnChange(setState)
    setReady(true)

    return () => {
      fileManagerRef.current?.destroy()
      fileManagerRef.current = undefined
      setReady(false)
    }
  }, [])

  const fetchAllTaggables = useCallback(
    (tagIds?: number[]) => fileManagerRef.current?.fetchAll(tagIds),
    [fileManagerRef]
  )

  return (
    <TaggableContext.Provider value={{ ...state, ready, fetchAllTaggables }}>
      {children}
    </TaggableContext.Provider>
  )
}

export function useTaggables() {
  const result = useContext(TaggableContext)

  if (!result) {
    throw new Error(
      'useTaggableIndexStatus() cannot be used without being wrapped by a TaggableIndexStatusProvider'
    )
  }

  return result
}
