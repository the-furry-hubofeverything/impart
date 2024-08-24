import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import update, { Spec } from 'immutability-helper'

function findTagAndGroupIndex(tagId: number, groups: Impart.TagGroup[]) {
  for (const [groupIndex, group] of groups.entries()) {
    const tagIndex = group.tags?.findIndex((t) => t.id === tagId)

    if (tagIndex != null && tagIndex != -1) {
      return {
        tagIndex,
        groupIndex
      }
    }
  }

  return null
}

interface TagData {
  groups?: Impart.TagGroup[]
  createGroup: () => Promise<void>
  editGroup: (...params: Parameters<typeof window.tagApi.editGroup>) => Promise<void>
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

  const createTag = useCallback(
    async (groupId: number) => {
      const tag = await window.tagApi.createTag(groupId)

      const groupIndex = groups?.findIndex((g) => g.id === groupId) ?? -1
      setGroups(update(groups, { [groupIndex]: { tags: { $push: [tag] } } }))
    },
    [groups]
  )

  const editTag = useCallback(
    async (...params: Parameters<typeof window.tagApi.editTag>) => {
      const tag = window.tagApi.editTag(...params)
      const [id, label, color] = params

      const indices = findTagAndGroupIndex(id, groups ?? [])
      if (!indices) {
        throw new Error('Tried to update non-existent tag')
      }

      const { tagIndex, groupIndex } = indices
      setGroups(
        update(groups, {
          [groupIndex]: { tags: { [tagIndex]: { label: { $set: label }, color: { $set: color } } } }
        })
      )
    },
    [groups]
  )

  return (
    <TagContext.Provider value={{ groups, createGroup, editGroup, createTag, editTag }}>
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
