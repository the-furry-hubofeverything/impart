import { useImpartIpcCall } from '@renderer/common/useImpartIpc'
import { produce } from 'immer'
import { useCallback } from 'react'

export function useTagActions(
  groups: Impart.TagGroup[] | undefined,
  setGroups: React.Dispatch<React.SetStateAction<Impart.TagGroup[] | undefined>>
) {
  const { callIpc: impartCreateTag } = useImpartIpcCall(window.tagApi.createTag, [])
  const { callIpc: impartEditTag } = useImpartIpcCall(window.tagApi.editTag, [])
  const { callIpc: impartDeleteTag } = useImpartIpcCall(window.tagApi.deleteTag, [])

  const createTag = useCallback(
    async (groupId: number) => {
      const tag = await impartCreateTag(groupId)

      if (!tag) {
        return
      }

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
      const result = await impartEditTag(...params)

      if (!result) {
        return
      }

      const { id, label, color } = result

      setGroups(
        produce(groups, (next) => {
          if (!next) {
            return
          }

          for (const group of next) {
            const tag = group.tags?.find((t) => t.id === id)

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
      const result = await impartDeleteTag(id)

      if (result !== true) {
        return
      }

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
