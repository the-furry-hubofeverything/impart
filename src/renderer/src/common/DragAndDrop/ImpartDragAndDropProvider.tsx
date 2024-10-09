import {
  useSensor,
  MouseSensor,
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import React, { useState } from 'react'
import { TaggableDisplay } from '../TaggableDisplay'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { DraggableData, DraggableType } from './Draggable'
import { Tag } from '../Tag'
import { DroppableData } from './Droppable'
import { useDropEvents } from './useDropEvents'

function findTag(tagId: number, groups?: Impart.TagGroup[]) {
  for (const group of groups ?? []) {
    const tag = group.tags?.find((t) => t.id === tagId)

    if (tag) {
      return tag
    }
  }
}

export interface ImpartDragAndDropProviderProps {
  children?: React.ReactNode
}

export function ImpartDragAndDropProvider({ children }: ImpartDragAndDropProviderProps) {
  const [current, setCurrent] = useState<DraggableData>()

  const { handle } = useDropEvents()

  const { taggables } = useTaggables()
  const { groups } = useTagGroups()

  const draggedTaggable = current?.type === 'taggable' && taggables.find((t) => t.id === current.id)
  const draggedTag = current?.type === 'tag' && findTag(current.id, groups)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  const handleDrop = (e: DragEndEvent) => {
    setCurrent(undefined)

    const draggable = e.active.data.current as DraggableData
    const droppable = e.over?.data.current as DroppableData | undefined

    if (droppable) {
      handle(draggable, droppable)
    }
  }

  return (
    <DndContext
      sensors={[mouseSensor]}
      onDragStart={(e) => setCurrent(e.active.data.current as DraggableData)}
      onDragEnd={handleDrop}
    >
      {children}
      <DragOverlay>
        {draggedTaggable && <TaggableDisplay taggable={draggedTaggable} />}
        {draggedTag && <Tag tag={draggedTag} />}
      </DragOverlay>
    </DndContext>
  )
}
