import { produce } from 'immer'
import { useCallback } from 'react'

export function useTagActions(
  groups: Impart.TagGroup[] | undefined,
  setGroups: React.Dispatch<React.SetStateAction<Impart.TagGroup[] | undefined>>
) {
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

  return { createTag, editTag, deleteTag }
}
