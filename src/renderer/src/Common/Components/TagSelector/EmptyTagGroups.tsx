import { Stack, Typography, Button } from '@mui/material'
import SparkleIcon from '@mui/icons-material/AutoAwesome'
import React from 'react'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'

export interface EmptyTagGroupsProps {}

export function EmptyTagGroups({}: EmptyTagGroupsProps) {
  const { reload } = useTagGroups()
  return (
    <Stack alignItems="center" gap={2} pt={5}>
      <Typography>No tag groups have been created yet!</Typography>
      <Button
        variant="contained"
        startIcon={<SparkleIcon />}
        color="success"
        onClick={async () => {
          await window.tagApi.createGroup()
          reload()
        }}
      >
        Create New Group
      </Button>
    </Stack>
  )
}
