import { useDroppable } from '@dnd-kit/core'
import { Box } from '@mui/material'
import React, { useEffect, useId } from 'react'
import { DraggableData, DraggableType } from './Draggable'
import { useImpartDragAndDrop } from './ImpartDragAndDropProvider'

export type DroppableType =
  | 'taggable'
  | 'stack'
  | 'home'
  | 'tagGroup'
  | 'tag'
  | 'tagGroupEnd'
  | 'file'

export interface DroppableData {
  type: DroppableType | DroppableType[]
  id: number
}

export interface DroppableProps {
  type: DroppableType | DroppableType[]
  id: number
  render: (props: { overType?: DraggableType; overId?: number }) => React.ReactNode
  onDrop?: (draggable: DraggableData) => void
}

export function Droppable({ type, id, render, onDrop }: DroppableProps) {
  const droppableId = useId()

  const { setNodeRef, active, isOver } = useDroppable({
    id: droppableId,
    data: {
      type,
      id
    } satisfies DroppableData
  })

  const { isValidDrop, lastDrop } = useImpartDragAndDrop()
  const over = active?.data.current as DraggableData | undefined

  const getValidType = () => {
    if (!isOver || !over) {
      return
    }

    return Array.isArray(over.type) ? over.type.find((t) => isValidDrop(t, type)) : over.type
  }

  useEffect(() => {
    if (lastDrop?.droppable.type === type && lastDrop.droppable.id === id) {
      onDrop && onDrop(lastDrop.draggable)
    }
  }, [lastDrop, onDrop])

  return <Box ref={setNodeRef}>{render({ overType: getValidType(), overId: over?.id })}</Box>
}
