import { useCallback, useMemo } from 'react'
import { DraggableData, DraggableType } from './Draggable'
import { DroppableData, DroppableType } from './Droppable'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { useImpartIpcCall } from '../../Hooks/useImpartIpc'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { useTaggableSelection } from '@renderer/TaggableSelectionProvider'
import { useConfirmationDialog } from '../ConfirmationDialogProvider'

interface DropEvent {
  dragType: DraggableType
  dropType: DroppableType
  action: (draggable: DraggableData, Droppable: DroppableData) => unknown
}

export function useDropEvents() {
  const { callIpc: bulkTag } = useImpartIpcCall(window.tagApi.bulkTag, [])
  const { callIpc: addTags } = useImpartIpcCall(window.tagApi.addTags, [])
  const { callIpc: reorderGroups } = useImpartIpcCall(window.tagApi.reorderGroups, [])
  const { callIpc: reorderTags } = useImpartIpcCall(window.tagApi.reorderTags, [])
  const { callIpc: addToStack } = useImpartIpcCall(window.stackApi.addToStack, [])
  const { callIpc: moveToHome } = useImpartIpcCall(window.stackApi.moveToHome, [])

  const confirm = useConfirmationDialog()

  const { reload: reloadTags, groups } = useTagGroups()
  const { reload: reloadTaggables, stackTrail } = useTaggables()
  const { selection } = useTaggableSelection()

  const endOfStack = stackTrail.length > 0 ? stackTrail[stackTrail.length - 1] : undefined

  const dropEvents = useMemo<DropEvent[]>(
    () => [
      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Tag item
      {
        dragType: 'tag',
        dropType: 'taggable',
        action: async (draggable, droppable) => {
          if (selection.length > 1 && selection.some((t) => t.id === droppable.id)) {
            confirm(
              {
                title: `Tag ${selection.length} items?`,
                confirmText: 'Tag'
              },
              async () => {
                await bulkTag(
                  selection.map((t) => t.id),
                  [draggable.id]
                )
                reloadTaggables()
              }
            )
          } else {
            await addTags(droppable.id, [draggable.id])
            reloadTaggables()
          }
        }
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Add taggables to stack
      {
        dragType: 'taggable',
        dropType: 'stack',
        action: async (_, droppable) => {
          //Learned this the hard way, we don't want to be able to add a stack
          // to itself
          if (selection.some((t) => t.id === droppable.id)) {
            return
          }

          await addToStack(
            selection.map((t) => t.id),
            droppable.id,
            endOfStack?.id
          )
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

          await moveToHome(
            selection.map((t) => t.id),
            endOfStack.id
          )

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
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Reorder tags
      {
        dragType: 'tag',
        dropType: 'tag',
        action: async (draggable, droppable) => {
          await reorderTags(
            draggable.id,
            groups?.find((g) => g.tags?.some((t) => t.id === droppable.id))?.id ?? -1,
            droppable.id
          )
          reloadTags()
        }
      },

      //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
      //Reorder tags
      {
        dragType: 'tag',
        dropType: 'tagGroupEnd',
        action: async (draggable, droppable) => {
          await reorderTags(draggable.id, droppable.id, 'end')
          reloadTags()
        }
      }
    ],
    [reloadTags, reloadTaggables, endOfStack, groups, selection]
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
          (Array.isArray(draggable.type)
            ? draggable.type.includes(e.dragType)
            : e.dragType === draggable.type) &&
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
