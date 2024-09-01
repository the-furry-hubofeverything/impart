import { useCallback } from 'react'

export function useTagGroupActions(
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

  return { createGroup, editGroup, deleteGroup }
}
