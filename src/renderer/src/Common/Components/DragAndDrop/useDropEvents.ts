import { useCallback, useMemo } from 'react'
import { DraggableData, DraggableType } from './Draggable'
import { DroppableData, DroppableType } from './Droppable'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { useImpartIpcCall } from '../../Hooks/useImpartIpc'

interface DropEvent {
  dragType: DraggableType
  dropType: DroppableType
  action: (draggable: DraggableData, Droppable: DroppableData) => unknown
}

export function useDropEvents() {
  const { callIpc: addTags } = useImpartIpcCall(window.tagApi.addTags, [])
  const { reload: reloadTags } = useTagGroups()

  const dropEvents = useMemo<DropEvent[]>(
    () => [
      {
        dragType: 'tag',
        dropType: 'taggable',
        action: async (draggable, droppable) => {
          await addTags(droppable.id, [draggable.id])
          reloadTags()
        }
      }
    ],
    [addTags, reloadTags]
  )

  const isValidDrop = useCallback(
    (dragType: DraggableType, dropType: DroppableType) =>
      dropEvents.some((e) => e.dragType === dragType && e.dropType === dropType),
    [dropEvents]
  )

  const handle = useCallback(
    (draggable: DraggableData, droppable: DroppableData) => {
      const event = dropEvents.find(
        (e) => e.dragType === draggable.type && e.dropType === droppable.type
      )

      if (event) {
        event.action(draggable, droppable)
        return true
      }

      return false
    },
    [dropEvents]
  )

  return { handle, isValidDrop }
}
