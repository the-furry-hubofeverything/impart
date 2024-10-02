import { useImpartIpcCall } from '@renderer/common/useImpartIpc'
import { useCallback } from 'react'

export function useTagGroupActions(
  groups: Impart.TagGroup[] | undefined,
  setGroups: React.Dispatch<React.SetStateAction<Impart.TagGroup[] | undefined>>
) {
  const { callIpc: impartCreateGroup } = useImpartIpcCall(window.tagApi.createGroup, [])
  const { callIpc: impartEditGroup } = useImpartIpcCall(window.tagApi.editGroup, [])
  const { callIpc: impartDeleteGroup } = useImpartIpcCall(window.tagApi.deleteGroup, [])

  const createGroup = useCallback(async () => {
    const group = await impartCreateGroup()

    if (group) {
      setGroups((g) => g?.concat([group]))
    }
  }, [])

  const editGroup = useCallback(
    async (...params: Parameters<typeof window.tagApi.editGroup>) => {
      const group = await impartEditGroup(...params)
      if (!group) {
        return
      }

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
      const result = await impartDeleteGroup(id)

      if (result !== true) {
        return
      }

      const copy = groups?.slice()

      copy?.splice(
        copy.findIndex((c) => c.id === id),
        1
      )

      setGroups(copy)
    },
    [groups]
  )

  return { createGroup, editGroup, deleteGroup }
}
