import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TaggableManager, TaggableState } from './taggableManager'
import { useDirectories } from '../DirectoryProvider'

interface TaggableData extends TaggableState {
  fetchTaggables: (options?: Impart.FetchTaggablesOptions) => Promise<void>
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

  const fetchTaggables = useCallback(
    (options?: Impart.FetchTaggablesOptions) => taggableManager.fetchTaggables(options),
    []
  )

  return (
    <TaggableContext.Provider value={{ ...state, fetchTaggables }}>
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
