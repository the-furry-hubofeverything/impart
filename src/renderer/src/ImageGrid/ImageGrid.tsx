import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { ImageDisplay } from './ImageDisplay'
import { useAsyncData } from '../common/useAsyncData'
import { useFiles } from '../FileProvider/FileProvider'

export interface ImageGridProps {}

export function ImageGrid({}: ImageGridProps) {
  const { files } = useFiles()

  if (!files) {
    return null
  }

  return (
    <Grid container spacing={1}>
      {files?.map((f) => (
        <Grid item key={f.path} xs={true}>
          <ImageDisplay image={f} />
        </Grid>
      ))}
    </Grid>
  )
}
