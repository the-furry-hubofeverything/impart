import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ImageDisplay } from './ImageDisplay'
import { useAsyncData } from '../common/useAsyncData'
import { useFileIndexStatus } from '../FileIndexStatusProvider'

export interface ImageGridProps {}

export function ImageGrid({}: ImageGridProps) {
  const { data: files, executeRequest: reloadFiles } = useAsyncData(
    () => window.fileApi.getFiles(),
    []
  )

  const { isIndexing } = useFileIndexStatus()

  useEffect(() => {
    if (isIndexing) {
      const interval = setInterval(reloadFiles, 1000)

      return () => clearInterval(interval)
    }
  }, [isIndexing])

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
