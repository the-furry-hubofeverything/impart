import {
  useSensor,
  MouseSensor,
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  pointerWithin,
  rectIntersection
} from '@dnd-kit/core'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import React, { useState } from 'react'
import { TaggableDisplay } from '../TaggableDisplay'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { DraggableData, DraggableType } from './Draggable'
import { Tag } from '../Tag/Tag'
import { DroppableData, DroppableType } from './Droppable'
import { useDropEvents } from './useDropEvents'
import { createContext, useContext } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { TagGroup } from '../TagSelector/TagGroup'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CenteredOverlay } from '../CenteredOverlay'
import { useTaggableSelection } from '@renderer/TaggableSelectionProvider'
import AddIcon from '@mui/icons-material/AddRounded'

interface Drop {
  draggable: DraggableData
  droppable: DroppableData
}

export interface ImpartDragAndDropData {
  getValidDropTypes: (
    draggable: DraggableData,
    droppable: DroppableData
  ) => { dragType: DraggableType; dropType: DroppableType } | undefined
  lastDrop?: Drop
}

const ImpartDragAndDropContext = createContext<ImpartDragAndDropData | null>(null)

export interface ImpartDragAndDropProviderProps {
  children?: React.ReactNode
}

export function ImpartDragAndDropProvider({ children }: ImpartDragAndDropProviderProps) {
  const [current, setCurrent] = useState<DraggableData>()
  const [successfulDrop, setSuccesfulDrop] = useState(false)
  const [lastDrop, setLastDrop] = useState<Drop>()

  const { handle, getValidDropTypes } = useDropEvents()

  const { selection } = useTaggableSelection()
  const { taggables } = useTaggables()
  const { groups, tags } = useTagGroups()

  const draggedTaggable = current?.type === 'taggable' && taggables.find((t) => t.id === current.id)
  const draggedTag = current?.type === 'tag' && tags?.find((t) => t.id === current.id)
  const draggedGroup = current?.type === 'tagGroup' && groups?.find((t) => t.id === current.id)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  const handleDrag = (e: DragStartEvent) => {
    setCurrent(e.active.data.current as DraggableData)
    setSuccesfulDrop(false)
  }

  const handleDrop = (e: DragEndEvent) => {
    setCurrent(undefined)

    const draggable = e.active.data.current as DraggableData
    const droppable = e.over?.data.current as DroppableData | undefined

    if (droppable) {
      const dropAccepted = handle(draggable, droppable)
      setSuccesfulDrop(dropAccepted)

      if (dropAccepted) {
        setLastDrop({ draggable, droppable })
      }
    }
  }

  return (
    <ImpartDragAndDropContext.Provider value={{ getValidDropTypes, lastDrop }}>
      <DndContext
        sensors={[mouseSensor]}
        onDragStart={handleDrag}
        onDragEnd={handleDrop}
        collisionDetection={(args) => {
          // First, let's see if there are any collisions with the pointer
          const pointerCollisions = pointerWithin(args)

          // Collision detection algorithms return an array of collisions
          if (pointerCollisions.length > 0) {
            return pointerCollisions
          }

          // If there are no collisions with the pointer, return rectangle intersections
          return rectIntersection(args)
        }}
      >
        {children}
        <DragOverlay
          dropAnimation={successfulDrop ? null : undefined}
          modifiers={draggedGroup ? [restrictToVerticalAxis] : undefined}
        >
          {draggedTaggable && (
            <CenteredOverlay
              show={selection.length > 1}
              overlay={
                <Box p={1} borderRadius={50} bgcolor="info.dark">
                  <Stack
                    width={40}
                    height={40}
                    borderRadius={50}
                    bgcolor="background.paper"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography fontWeight="bold" fontSize={30}>
                      {selection.length}
                    </Typography>
                  </Stack>
                </Box>
              }
            >
              <Box sx={{ opacity: 0.8 }}>
                <TaggableDisplay taggable={draggedTaggable} />
              </Box>
            </CenteredOverlay>
          )}
          {draggedTag && <Tag tag={draggedTag} />}
          {draggedGroup && <TagGroup group={draggedGroup} />}
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
