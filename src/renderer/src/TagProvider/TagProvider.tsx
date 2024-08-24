import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

interface TagData {
  groups?: Impart.TagGroup[]
  createGroup: () => Promise<void>
  editGroup: (id: number, label?: string, defaultTagColor?: string) => Promise<void>
}

const TagContext = createContext<TagData | null>(null)

export interface TagProviderProps {
  children?: React.ReactNode
}

export function TagProvider({ children }: TagProviderProps) {
  const [groups, setGroups] = useState<Impart.TagGroup[]>()

  useEffect(() => {
    ;(async () => {
      setGroups(await window.tagApi.getGroups())
    })()
  }, [])

  const createGroup = useCallback(async () => {
    const group = await window.tagApi.createGroup()
    setGroups((g) => g?.concat([group]))
  }, [])

  const editGroup = useCallback(
    async (id: number, label?: string, defaultTagColor?: string) => {
      const group = await window.tagApi.editGroup(id, label, defaultTagColor)
      const copy = groups?.slice()

      copy?.splice(
        copy.findIndex((c) => c.id === id),
        1,
        group
      )

      setGroups(copy)
    },
    [groups]
  )

  return (
    <TagContext.Provider value={{ groups, createGroup, editGroup }}>{children}</TagContext.Provider>
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
