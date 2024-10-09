import { useCallback } from 'react'
import { DraggableData } from './Draggable'
import { DroppableData } from './Droppable'

export function useDropEvents() {
  const handle = useCallback((draggable: DraggableData, droppable: DroppableData) => {
    if (draggable.type === 'tag' && droppable.type === 'taggable') {
      console.log('Tag item!')
    }
  }, [])

  return { handle }
}
