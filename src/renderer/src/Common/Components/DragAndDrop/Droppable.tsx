import { useDroppable } from '@dnd-kit/core'
import { Box } from '@mui/material'
import React, { useEffect, useId } from 'react'
import { DraggableData, DraggableType } from './Draggable'
import { useImpartDragAndDrop } from './ImpartDragAndDropProvider'
import { DropIndicator } from '../TagSelector/DropIndicator'

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
  hideIndicator?: boolean
}

export function Droppable({ type, id, render, onDrop, hideIndicator }: DroppableProps) {
  const droppableId = useId()

  const { setNodeRef, active, isOver } = useDroppable({
    id: droppableId,
    data: {
      type,
      id
    } satisfies DroppableData
  })

  const { getValidDropTypes, lastDrop } = useImpartDragAndDrop()
  const over = active?.data.current as DraggableData | undefined
  const validDropTypes = over && isOver ? getValidDropTypes(over, { type, id }) : undefined

  if (validDropTypes) {
    console.log(validDropTypes)
  }

  useEffect(() => {
    if (lastDrop?.droppable.type === type && lastDrop.droppable.id === id) {
      onDrop && onDrop(lastDrop.draggable)
    }
  }, [lastDrop, onDrop])

  return (
    <Box ref={setNodeRef}>
      <DropIndicator show={validDropTypes != null && !hideIndicator}>
        {render({ overType: validDropTypes?.dragType, overId: over?.id })}
      </DropIndicator>
    </Box>
  )
}
