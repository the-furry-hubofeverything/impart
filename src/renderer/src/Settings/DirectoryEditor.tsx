import { Box, Card, CardHeader } from '@mui/material'
import React from 'react'

export interface DirectoryEditorProps {
  directory: Impart.Directory
  onChange?: (directory: Impart.Directory) => void
}

export function DirectoryEditor({ directory, onChange }: DirectoryEditorProps) {
  return (
    <Card variant="outlined">
      <CardHeader title={directory.path} />
    </Card>
  )
}
