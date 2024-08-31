import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { produce } from 'immer'

interface TagData {
  groups?: Impart.TagGroup[]
  createGroup: () => Promise<void>
  editGroup: (...params: Parameters<typeof window.tagApi.editGroup>) => Promise<void>
  deleteGroup: (...params: Parameters<typeof window.tagApi.deleteGroup>) => Promise<void>
  createTag: (grouupId: number) => Promise<void>
  editTag: (...params: Parameters<typeof window.tagApi.editTag>) => Promise<void>
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

  return (
    <TagContext.Provider
      value={{ groups, createGroup, editGroup, createTag, editTag, deleteGroup }}
    >
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
