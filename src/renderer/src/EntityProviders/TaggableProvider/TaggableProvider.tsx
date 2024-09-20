import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TaggableManager, TaggableState } from './taggableManager'
import { useDirectories } from '../DirectoryProvider'
import { usePartialState } from '@renderer/common/usePartialState'

interface TaggableData extends TaggableState {
  fetchTaggables: () => Promise<void>
  fetchOptions: Impart.FetchTaggablesOptions
  setFetchOptions: (options: Partial<Impart.FetchTaggablesOptions>) => void
}

const TaggableContext = createContext<TaggableData | null>(null)

export interface TaggableProviderProps {
  children?: React.ReactNode
}

const DEFAULT_ORDER_KEY = 'defaultOrder'

const taggableManager = new TaggableManager()

export function TaggableProvider({ children }: TaggableProviderProps) {
  const [state, setState] = useState<TaggableState>(TaggableManager.getInitialState())
  const { executeRequest: reloadDirectories } = useDirectories()

  const [fetchOptions, setFetchOptions] = usePartialState<Impart.FetchTaggablesOptions>(() => ({
    order: (localStorage.getItem(DEFAULT_ORDER_KEY) as 'alpha' | 'date' | null) ?? 'alpha'
  }))

  useEffect(() => {
    if (fetchOptions.order) {
      localStorage.setItem(DEFAULT_ORDER_KEY, fetchOptions.order)
    }
  }, [fetchOptions.order])

  useEffect(() => {
    taggableManager.setOnChange(setState)
    taggableManager.setOnFinishIndexing(() => {
      console.log('Finished indexing, reloading directories')
      reloadDirectories()
    })
  }, [])

  const fetchTaggables = useCallback(
    () => taggableManager.fetchTaggables(fetchOptions),
    [fetchOptions]
  )

  //The function changes every time the fetch options change
  // which means this will be called every time the fetch
  // options change
  useEffect(() => {
    fetchTaggables()
  }, [fetchTaggables])

  useEffect(() => {
    if (state.isIndexing) {
      let interval = setInterval(() => fetchTaggables(), 1000)

      return () => clearInterval(interval)
    }
  }, [state.isIndexing])

  return (
    <TaggableContext.Provider value={{ ...state, fetchTaggables, fetchOptions, setFetchOptions }}>
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
