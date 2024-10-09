import { useSensor, MouseSensor, DndContext, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import React, { useState } from 'react'
import { TaggableDisplay } from '../TaggableDisplay'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { DraggableData, DraggableType } from './Draggable'
import { Tag } from '../Tag'

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

  const { taggables } = useTaggables()
  const { groups } = useTagGroups()

  const draggedTaggable = current?.type === 'taggable' && taggables.find((t) => t.id === current.id)
  const draggedTag = current?.type === 'tag' && findTag(current.id, groups)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  return (
    <DndContext
      sensors={[mouseSensor]}
      onDragStart={(e) => setCurrent(e.active.data.current as DraggableData | undefined)}
      onDragEnd={(e) => setCurrent(undefined)}
    >
      {children}
      <DragOverlay>
        {draggedTaggable && <TaggableDisplay taggable={draggedTaggable} />}
        {draggedTag && <Tag tag={draggedTag} />}
      </DragOverlay>
    </DndContext>
  )
}
