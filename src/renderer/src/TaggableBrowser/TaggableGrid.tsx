import { Grid } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { forwardRef } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'

const gridComponents: GridComponents = {
  List: forwardRef(({ children, ...props }, ref) => (
    <Grid container {...props} ref={ref}>
      {children}
    </Grid>
  )),
  Item: forwardRef(({ children, ...props }, ref) => (
    <Grid item {...props} ref={ref} xs={true}>
      {children}
    </Grid>
  ))
}

export interface TaggableGridProps {
  taggables?: Impart.Taggable[]
  selection?: Impart.Taggable[]
  onSelect?: (item: Impart.Taggable, add: boolean, range: boolean) => void
  onRightClick?: (item: Impart.Taggable, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function TaggableGrid({ taggables, selection, onSelect, onRightClick }: TaggableGridProps) {
  if (!taggables) {
    return null
  }

  return (
    <VirtuosoGrid
      data={taggables}
      totalCount={taggables.length}
      components={gridComponents}
      overscan={{ main: 1000, reverse: 1000 }}
      itemContent={(index, f) => (
        <TaggableDisplay
          taggable={f}
          isSelected={selection?.some((s) => s.id === f.id)}
          onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
          onRightClick={(e) => onRightClick && onRightClick(f, e)}
        />
      )}
    />
    // <Grid container spacing={1}>
    //   {taggables?.map((f) => (
    //     <Grid item key={f.id} xs={true}>
    //       <TaggableDisplay
    //         taggable={f}
    //         isSelected={selection?.some((s) => s.id === f.id)}
    //         onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
    //         onRightClick={(e) => onRightClick && onRightClick(f, e)}
    //       />
    //     </Grid>
    //   ))}
    // </Grid>
  )
}
