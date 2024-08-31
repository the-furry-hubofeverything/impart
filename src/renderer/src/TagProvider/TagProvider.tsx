import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { produce } from 'immer'

interface TagData extends ReturnType<typeof useTagApi> {
  groups?: Impart.TagGroup[]
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

  const tagApi = useTagApi(groups, setGroups)

  return <TagContext.Provider value={{ groups, ...tagApi }}>{children}</TagContext.Provider>
}

function useTagApi(
  groups: Impart.TagGroup[] | undefined,
  setGroups: React.Dispatch<React.SetStateAction<Impart.TagGroup[] | undefined>>
) {
  const createGroup = useCallback(async () => {
    const group = await window.tagApi.createGroup()
    setGroups((g) => g?.concat([group]))
  }, [])

  const editGroup = useCallback(
    async (...params: Parameters<typeof window.tagApi.editGroup>) => {
      const group = await window.tagApi.editGroup(...params)
      const copy = groups?.slice()

      const [id] = params

      copy?.splice(
        copy.findIndex((c) => c.id === id),
        1,
        group
      )

      setGroups(copy)
    },
    [groups]
  )

  const deleteGroup = useCallback(
    async (id: number) => {
      await window.tagApi.deleteGroup(id)

      const copy = groups?.slice()

      copy?.splice(
        copy.findIndex((c) => c.id === id),
        1
      )

      setGroups(copy)
    },
    [groups]
  )

  const createTag = useCallback(
    async (groupId: number) => {
      const tag = await window.tagApi.createTag(groupId)

      setGroups(
        produce(groups, (next) => {
          const group = next?.find((g) => g.id === groupId)

          if (!group) {
            return
          }

          if (group.tags == null) {
            group.tags = [tag]
          } else {
            group.tags.push(tag)
          }
        })
      )
    },
    [groups]
  )

  const editTag = useCallback(
    async (...params: Parameters<typeof window.tagApi.editTag>) => {
      await window.tagApi.editTag(...params)
      const [tagId, label, color] = params

      setGroups(
        produce(groups, (next) => {
          if (!next) {
            return
          }

          for (const group of next) {
            const tag = group.tags?.find((t) => t.id === tagId)

            if (tag) {
              tag.label = label
              tag.color = color
            }
          }
        })
      )
    },
    [groups]
  )

  const deleteTag = useCallback(
    async (id: number) => {
      await window.tagApi.deleteTag(id)

      setGroups(
        produce(groups, (next) => {
          for (const group of next ?? []) {
            const tagIndex = group.tags?.findIndex((t) => t.id === id) ?? -1

            if (tagIndex != -1) {
              group.tags?.splice(tagIndex, 1)
              return
            }
          }
        })
      )
    },
    [groups]
  )

  return { createGroup, editGroup, deleteGroup, createTag, editTag, deleteTag }
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
