import {
  Stack,
  Typography,
  Button,
  Box,
  Collapse,
  Divider,
  Grid2,
  TextField,
  styled,
  BoxProps
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SparkleIcon from '@mui/icons-material/AutoAwesome'
import { TagGroup } from './TagGroup'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { Tag } from '../Tag'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import { SearchBar } from '../SearchBar'
import { Draggable } from '../DragAndDrop'
import { Droppable } from '../DragAndDrop/Droppable'

const DropIndicator = styled(Box)<BoxProps & { showIndicator: boolean }>(
  ({ showIndicator, theme }) =>
    showIndicator
      ? {
          borderTop: `3px solid ${theme.palette.primary.main}`,
          marginTop: '-6px',
          paddingTop: '3px'
        }
      : {}
)

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
    { toggleMode: true }
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
          <Droppable
            key={g.id}
            id={g.id}
            type="tagGroup"
            render={({ overType }) => (
              <DropIndicator showIndicator={overType != null}>
                <Draggable type="tagGroup" id={g.id} exposeHandle>
                  <TagGroup
                    group={g}
                    selectedTags={selection}
                    filter={filter}
                    onSelect={selectItem}
                  />
                </Draggable>
              </DropIndicator>
            )}
          />
        ))}

        <Droppable
          type="tagGroup"
          id={-1}
          render={({ overType }) => (
            <DropIndicator showIndicator={overType != null}>
              <Button
                onClick={async () => {
                  await window.tagApi.createGroup()
                  reload()
                }}
              >
                <AddIcon />
              </Button>
            </DropIndicator>
          )}
        />
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
