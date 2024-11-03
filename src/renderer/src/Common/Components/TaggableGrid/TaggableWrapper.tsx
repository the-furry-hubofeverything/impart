import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Draggable } from '../DragAndDrop'
import { Droppable, DroppableType } from '../DragAndDrop/Droppable'
import { TaggableDisplay } from '../TaggableDisplay'
import { isTaggableStack, isTaggableFile } from '@renderer/Common/taggable'
import { TagAppliedAnimation } from './TagAppliedAnimation'

function buildDropType(taggable: Impart.Taggable): DroppableType | DroppableType[] {
  if (isTaggableStack(taggable)) {
    return ['taggable', 'stack']
  } else if (isTaggableFile(taggable)) {
    return ['taggable', 'file']
  }

  return 'taggable'
}

export interface TaggableWrapperProps {
  taggable: Impart.Taggable
  selection?: Impart.Taggable[]
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onRightClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onDoubleClick?: (item: Impart.Taggable) => void
}

export function TaggableWrapper({
  taggable,
  selection,
  onMouseDown,
  onClick,
  onDoubleClick,
  onRightClick
}: TaggableWrapperProps) {
  //Instead of using true/false to render the tagging animation, we
  // use an increment which allows for sequential tag drops to unmount
  // and remount the tag animation, resetting it for each tag dropped
  const [tagIncrement, setTagIncrement] = useState(0)
  const [lastTagIncrement, setLastTagIncrement] = useState(0)

  useEffect(() => {
    setLastTagIncrement(tagIncrement)
  }, [tagIncrement])

  return (
    <TagAppliedAnimation
      show={tagIncrement > 0 && tagIncrement === lastTagIncrement}
      onHide={() => {
        setTagIncrement(0)
        setLastTagIncrement(0)
      }}
    >
      <Droppable
        type={buildDropType(taggable)}
        id={taggable.id}
        onDrop={(d) =>
          d.type === 'tag' &&
          !taggable.tags.some((t) => t.id === d.id) &&
          setTagIncrement(tagIncrement + 1)
        }
        render={({ overType }) => (
          <Draggable id={taggable.id} type="taggable">
            <Box
              onContextMenu={(e) => {
                onRightClick && onRightClick(e, taggable)
              }}
              onMouseDown={(e) => onMouseDown && onMouseDown(e, taggable)}
              onClick={(e) => onClick && onClick(e, taggable)}
              onDoubleClick={() => onDoubleClick && onDoubleClick(taggable)}
            >
              <TaggableDisplay
                taggable={taggable}
                isSelected={selection?.some((s) => s.id === taggable.id)}
                showTags={overType === 'tag'}
              />
            </Box>
          </Draggable>
        )}
      ></Droppable>
    </TagAppliedAnimation>
  )
}
