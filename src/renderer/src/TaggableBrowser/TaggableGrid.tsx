import { Box, Grid } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { BOX_HEIGHT, BOX_WIDTH } from '@renderer/common/TaggableDisplay/TaggableDisplay'
import { useEffect, useRef, useState } from 'react'
import { VariableSizeGrid } from 'react-window'

export interface TaggableGridProps {
  taggables?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  onSelect?: (item: Impart.Taggable, add: boolean, range: boolean) => void
  onRightClick?: (item: Impart.Taggable, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export function TaggableGrid({ taggables, selection, onSelect, onRightClick }: TaggableGridProps) {
  if (!taggables) {
    return null
  }

  const { width, height } = useWindowDimensions()

  const cellWidth = BOX_WIDTH + 40
  const columnCount = Math.floor((width - 350) / cellWidth)

  return (
    <VariableSizeGrid
      columnCount={columnCount}
      columnWidth={(index) => cellWidth}
      rowCount={Math.ceil(taggables.length / columnCount)}
      rowHeight={(index) => BOX_HEIGHT + 40}
      width={width - 350}
      height={height}
    >
      {({ columnIndex, rowIndex, style }) => {
        const taggable = taggables[rowIndex * columnCount + columnIndex]

        if (!taggable) {
          return null
        }

        return (
          <div style={style}>
            <TaggableDisplay
              taggable={taggable}
              isSelected={selection?.some((s) => s.id === taggable.id)}
              onClick={({ ctrl, shift }) => onSelect && onSelect(taggable, ctrl, shift)}
              onRightClick={(e) => onRightClick && onRightClick(taggable, e)}
            />
          </div>
        )
      }}
    </VariableSizeGrid>
  )
}
