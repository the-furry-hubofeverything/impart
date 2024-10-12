import { useCallback, useMemo } from 'react'
import { DraggableData, DraggableType } from './Draggable'
import { DroppableData, DroppableType } from './Droppable'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { useImpartIpcCall } from '../../Hooks/useImpartIpc'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

interface DropEvent {
  dragType: DraggableType
  dropType: DroppableType
  action: (draggable: DraggableData, Droppable: DroppableData) => unknown
}

export function useDropEvents() {
  const { callIpc: addTags } = useImpartIpcCall(window.tagApi.addTags, [])
  const { callIpc: addToStack } = useImpartIpcCall(window.stackApi.addToStack, [])
  const { callIpc: moveToHome } = useImpartIpcCall(window.stackApi.moveToHome, [])

  const { reload: reloadTags } = useTagGroups()
  const {
    reload: reloadTaggables,
    fetchOptions: { stackId }
  } = useTaggables()

  const dropEvents = useMemo<DropEvent[]>(
    () => [
      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Tag item
      {
        dragType: 'tag',
        dropType: 'taggable',
        action: async (draggable, droppable) => {
          await addTags(droppable.id, [draggable.id])
          reloadTags()
        }
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Add item to stack
      {
        dragType: 'taggable',
        dropType: 'stack',
        action: async (draggable, droppable) => {
          await addToStack([draggable.id], droppable.id)
          reloadTaggables()
        }
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Move items to home
      {
        dragType: 'taggable',
        dropType: 'home',
        action: async (draggable, droppable) => {
          if (!stackId) {
            throw new Error('Tried to move taggables from home to home')
          }

          await moveToHome([draggable.id], stackId)
          reloadTaggables()
        }
      }
    ],
    [reloadTags, reloadTaggables, stackId]
  )

  const isValidDrop = useCallback(
    (dragType: DraggableType, dropType: DroppableType | DroppableType[]) =>
      dropEvents.some(
        (e) =>
          e.dragType === dragType &&
          (Array.isArray(dropType) ? dropType.includes(e.dropType) : e.dropType === dropType)
      ),
    [dropEvents]
  )

  const handle = useCallback(
    (draggable: DraggableData, droppable: DroppableData) => {
      const event = dropEvents.find(
        (e) =>
          e.dragType === draggable.type &&
          (Array.isArray(droppable.type)
            ? droppable.type.includes(e.dropType)
            : e.dropType === droppable.type)
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
