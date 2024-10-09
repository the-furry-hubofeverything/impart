import { useDroppable } from '@dnd-kit/core'
import { Box } from '@mui/material'
import React from 'react'

export type DroppableType = 'taggable'

export interface DroppableData {
  type: DroppableType
  id: number
}

export interface DroppableProps {
  type: DroppableType
  id: number
  render: (props: { isOver: boolean }) => React.ReactNode
}

export function Droppable({ type, id, render }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${type}-${id}`,
    data: {
      type,
      id
    } satisfies DroppableData
  })

  return <Box ref={setNodeRef}>{render({ isOver })}</Box>
}
