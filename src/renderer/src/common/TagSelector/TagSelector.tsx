import {
  Stack,
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  Button,
  Chip,
  TextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMultiSelection } from '../useMultiSelection'
import { useMemo } from 'react'
import { Tag } from '../Tag'
import SparkleIcon from '@mui/icons-material/AutoAwesome'
import { TagGroup } from './TagGroup'
import { useTagGroups } from '@renderer/TagProvider'

export interface TagSelectorProps {
  selection?: Impart.Tag[]
  onChange?: (selection: Impart.Tag[]) => void
}

export function TagSelector({ selection, onChange }: TagSelectorProps) {
  const { groups, createGroup } = useTagGroups()
  const tags = useMemo(() => groups?.flatMap((g) => g.tags ?? []) ?? [], [groups])

  const { selectItem, itemIsSelected } = useMultiSelection(
    tags,
    selection ?? [],
    onChange,
    (a, b) => a.id === b.id,
    { toggleMode: true }
  )

  if (groups?.length === 0) {
    return (
      <Stack alignItems="center" gap={2} pt={5}>
        <Typography>No tag groups have been created yet!</Typography>
        <Button
          variant="contained"
          startIcon={<SparkleIcon />}
          color="success"
          onClick={createGroup}
        >
          Create New Group
        </Button>
      </Stack>
    )
  }

  return (
    <Stack gap={2}>
      {groups?.map((g) => (
        <TagGroup key={g.id} group={g} selectedTags={selection} onSelect={selectItem} />
      ))}
      <Button onClick={createGroup}>
        <AddIcon />
      </Button>
    </Stack>
  )
}
