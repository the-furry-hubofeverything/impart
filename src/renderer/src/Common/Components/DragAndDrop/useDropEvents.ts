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
  const { callIpc: reorderGroups } = useImpartIpcCall(window.tagApi.reorderGroups, [])
  const { callIpc: addToStack } = useImpartIpcCall(window.stackApi.addToStack, [])
  const { callIpc: moveToHome } = useImpartIpcCall(window.stackApi.moveToHome, [])

  const { reload: reloadTags } = useTagGroups()
  const { reload: reloadTaggables, stackTrail, setStackTrail } = useTaggables()

  const endOfStack = stackTrail.length > 0 ? stackTrail[stackTrail.length - 1] : undefined

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
          //Learned this the hard way, we don't want to be able to add a stack
          // to itself
          if (draggable.id === droppable.id) {
            return
          }

          await addToStack([draggable.id], droppable.id, endOfStack?.id)
          reloadTaggables()
        }
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Move items to home
      {
        dragType: 'taggable',
        dropType: 'home',
        action: async (draggable, droppable) => {
          if (!endOfStack) {
            throw new Error('Tried to move taggables from home to home')
          }

          await moveToHome([draggable.id], endOfStack.id)
          reloadTaggables()
        }
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Reorder tag groups
      {
        dragType: 'tagGroup',
        dropType: 'tagGroup',
        action: async (draggable, droppable) => {
          await reorderGroups(draggable.id, droppable.id !== -1 ? droppable.id : 'end')
          reloadTags()
        }
      }
    ],
    [reloadTags, reloadTaggables, endOfStack]
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
