import { Stack, Typography, Button, Box, Collapse, Divider, Grid2, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SparkleIcon from '@mui/icons-material/AutoAwesome'
import { TagGroup } from './TagGroup'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { Tag } from '../Tag'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import { SearchBar } from '../SearchBar'

export interface TagSelectorProps {
  selection?: Impart.Tag[]
  onChange?: (selection: Impart.Tag[]) => void
}

export function TagSelector({ selection, onChange }: TagSelectorProps) {
  const { groups, reload, tags } = useTagGroups()

  const { selectItem } = useMultiSelection(
    tags ?? [],
    selection ?? [],
    onChange,
    useCallback((a, b) => a.id === b.id, []),
    { toggleMode: true, resetSelectionCondition: 'invalid' }
  )

  const [filter, setFilter] = useState<string>()

  if (groups?.length === 0) {
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

  return (
    <Stack height="100%" gap={2} justifyContent="space-between">
      <Stack
        gap={2}
        sx={{
          '& .MuiButton-root': {
            opacity: 0,
            transition: '0.2s'
          },
          '&:hover .MuiButton-root': {
            opacity: 1
          }
        }}
      >
        <SearchBar value={filter} onChange={setFilter} />
        {groups?.map((g) => (
          <TagGroup
            key={g.id}
            group={g}
            selectedTags={selection}
            filter={filter}
            onSelect={selectItem}
          />
        ))}

        <Button
          onClick={async () => {
            await window.tagApi.createGroup()
            reload()
          }}
        >
          <AddIcon />
        </Button>
      </Stack>
      {(selection?.length ?? 0) > 0 && (
        <>
          <Divider />
          <Box pt={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Selected Tags</Typography>
              <Button
                startIcon={<FilterAltOffIcon />}
                size="small"
                onClick={() => onChange && onChange([])}
              >
                Clear all
              </Button>
            </Stack>
            <Grid2 container spacing={2} pt={1}>
              {selection?.map((t) => (
                <Grid2 key={t.id}>
                  <Tag tag={t} onClick={() => selectItem(t)} />
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </>
      )}
    </Stack>
  )
}
