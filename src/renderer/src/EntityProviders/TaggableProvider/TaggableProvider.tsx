import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TaggableManager, TaggableState } from './taggableManager'
import { useDirectories } from '../DirectoryProvider'

interface TaggableData extends TaggableState {
  startNewFetch: (tagIds?: number[]) => Promise<void>
  fetchNext: () => Promise<boolean>
}

const TaggableContext = createContext<TaggableData | null>(null)

export interface TaggableProviderProps {
  children?: React.ReactNode
}

const taggableManager = new TaggableManager()

export function TaggableProvider({ children }: TaggableProviderProps) {
  const [state, setState] = useState<TaggableState>(TaggableManager.getInitialState())
  const { executeRequest: reloadDirectories } = useDirectories()

  useEffect(() => {
    taggableManager.setOnChange(setState)
    taggableManager.setOnFinishIndexing(() => {
      console.log('Finished indexing, reloading directories')
      reloadDirectories()
    })
  }, [])

  const startNewFetch = useCallback(
    (tagIds?: number[]) => taggableManager.startNewFetch({ tagIds }),
    []
  )

  const fetchNext = useCallback(() => taggableManager.fetchNext(), [])

  return (
    <TaggableContext.Provider value={{ ...state, startNewFetch, fetchNext }}>
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
