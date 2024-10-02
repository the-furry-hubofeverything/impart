import { createContext, useContext } from 'react'
import { useImpartIpcData } from '@renderer/common/useImpartIpc'

interface TagData {
  groups?: Impart.TagGroup[]
  isLoading: boolean
  reload: () => void
}

const TagContext = createContext<TagData | null>(null)

export interface TagProviderProps {
  children?: React.ReactNode
}

export function TagProvider({ children }: TagProviderProps) {
  const { data: groups, isLoading, reload } = useImpartIpcData(() => window.tagApi.getGroups(), [])

  return <TagContext.Provider value={{ groups, isLoading, reload }}>{children}</TagContext.Provider>
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
