import { createContext, useContext, useEffect, useState } from 'react'
import { useTagActions } from './useTagActions'
import { useTagGroupActions } from './useTagGroupActions'
import { useImpartIpcCall } from '@renderer/common/useImpartIpc'

interface TagData extends ReturnType<typeof useTagActions>, ReturnType<typeof useTagGroupActions> {
  groups?: Impart.TagGroup[]
}

const TagContext = createContext<TagData | null>(null)

export interface TagProviderProps {
  children?: React.ReactNode
}

export function TagProvider({ children }: TagProviderProps) {
  const [groups, setGroups] = useState<Impart.TagGroup[]>()
  const { callIpc: getGroups } = useImpartIpcCall(window.tagApi.getGroups, [])

  useEffect(() => {
    ;(async () => {
      setGroups((await getGroups()) ?? [])
    })()
  }, [])

  const tagApi = useTagActions(groups, setGroups)
  const tagGroupApi = useTagGroupActions(groups, setGroups)

  return (
    <TagContext.Provider value={{ groups, ...tagApi, ...tagGroupApi }}>
      {children}
    </TagContext.Provider>
  )
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
