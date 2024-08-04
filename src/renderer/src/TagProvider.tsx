import { createContext, useContext } from 'react'
import { useAsyncData } from './common/useAsyncData'

export interface TagData {
  tags: ReturnType<typeof useAsyncData<Impart.TagGroup[]>>
}

const TagContext = createContext<TagData | null>(null)

export interface TagProviderProps {
  children?: React.ReactNode
}

export function TagProvider({ children }: TagProviderProps) {
  const tags = useAsyncData(() => window.tagApi.getGroups(), [])

  return <TagContext.Provider value={{ tags }}>{children}</TagContext.Provider>
}

export function useTags() {
  const result = useContext(TagContext)

  if (!result) {
    throw new Error('useTag() cannot be used without being wrapped by a TagProvider')
  }

  return result.tags
}
