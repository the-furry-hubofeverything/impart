import { useDraggable } from '@dnd-kit/core'
import { Box } from '@mui/material'
import React from 'react'

export type DraggableType = 'taggable' | 'tag'

export interface DraggableData {
  type: DraggableType
  id: number
}

export interface DraggableProps {
  children: React.ReactNode
  id: number
  type: DraggableType
}

export function Draggable({ children, id, type }: DraggableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${type}-${id}`,
    data: {
      id,
      type
    } satisfies DraggableData
  })

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ visibility: isDragging ? 'hidden' : undefined }}
    >
      {children}
    </Box>
  )
}
