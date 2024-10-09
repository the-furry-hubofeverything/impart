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
import { DroppableData, DroppableType } from './Droppable'
import { useDropEvents } from './useDropEvents'
import { createContext, useContext } from 'react'

function findTag(tagId: number, groups?: Impart.TagGroup[]) {
  for (const group of groups ?? []) {
    const tag = group.tags?.find((t) => t.id === tagId)

    if (tag) {
      return tag
    }
  }
}

export interface ImpartDragAndDropData {
  isValidDrop: (dragType: DraggableType, dropType: DroppableType) => boolean
}

const ImpartDragAndDropContext = createContext<ImpartDragAndDropData | null>(null)

export interface ImpartDragAndDropProviderProps {
  children?: React.ReactNode
}

export function ImpartDragAndDropProvider({ children }: ImpartDragAndDropProviderProps) {
  const [current, setCurrent] = useState<DraggableData>()

  const { handle, isValidDrop } = useDropEvents()

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
    <ImpartDragAndDropContext.Provider value={{ isValidDrop }}>
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
    </ImpartDragAndDropContext.Provider>
  )
}

export function useImpartDragAndDrop() {
  const result = useContext(ImpartDragAndDropContext)

  if (!result) {
    throw new Error(
      'useImpartDragAndDrop() cannot be used without being wrapped by a ImpartDragAndDropProvider'
    )
  }

  return result
}
