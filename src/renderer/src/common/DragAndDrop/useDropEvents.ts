import { useCallback, useMemo } from 'react'
import { DraggableData, DraggableType } from './Draggable'
import { DroppableData, DroppableType } from './Droppable'

interface DropEvent {
  dragType: DraggableType
  dropType: DroppableType
  action: (draggable: DraggableData, Droppable: DroppableData) => unknown
}

export function useDropEvents() {
  const dropEvents = useMemo<DropEvent[]>(
    () => [
      {
        dragType: 'tag',
        dropType: 'taggable',
        action: (draggable, droppable) => {
          console.log('Tag item!')
        }
      }
    ],
    []
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
      }
    },
    [dropEvents]
  )

  return { handle, isValidDrop }
}
