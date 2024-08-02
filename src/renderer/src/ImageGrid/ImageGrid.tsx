import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { ImageDisplay } from './ImageDisplay'
import { useAsyncData } from '../common/useAsyncData'
import { useFiles } from '../FileProvider/FileProvider'

export interface ImageGridProps {}

export function ImageGrid({}: ImageGridProps) {
  const { files } = useFiles()

  const [previousSelection, setPreviousSelection] = useState<Impart.TaggableImage>()
  const [selection, setSelection] = useState<Impart.TaggableImage[]>([])

  const selectItem = (item: Impart.TaggableImage, add: boolean, range: boolean) => {
    let selectedItems: Impart.TaggableImage[] = []

    if (range && previousSelection) {
      const prevIndex = files.findIndex((f) => f.id === previousSelection.id)
      const nextIndex = files.findIndex((f) => f.id === item.id)

      selectedItems = files.slice(
        Math.min(prevIndex, nextIndex),
        Math.max(prevIndex, nextIndex) + 1
      )
    } else {
      selectedItems = [item]
    }

    if (add) {
      const notYetSelectedItems = selectedItems.filter(
        (i) => !selection?.some((s) => s.id === i.id)
      )
      setSelection(selection.concat(notYetSelectedItems))
    } else {
      setSelection(selectedItems)
    }

    setPreviousSelection(item)
  }

  if (!files) {
    return null
  }

  return (
    <Grid container spacing={1}>
      {files?.map((f) => (
        <Grid item key={f.path} xs={true}>
          <ImageDisplay
            image={f}
            isSelected={selection?.some((s) => s.id === f.id)}
            onClick={({ ctrl, shift }) => selectItem(f, ctrl, shift)}
          />
        </Grid>
      ))}
    </Grid>
  )
}
