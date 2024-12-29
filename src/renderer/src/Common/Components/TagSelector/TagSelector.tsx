import {
  Stack,
  Typography,
  Button,
  Box,
  Divider,
  styled,
  BoxProps,
  IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/AddRounded'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { useCallback, useState } from 'react'
import { TagGroup } from './TagGroup'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { SearchBar } from '../SearchBar'
import { Draggable } from '../DragAndDrop'
import { Droppable } from '../DragAndDrop/Droppable'
import { TagSelection } from './TagSelection'
import { EmptyTagGroups } from './EmptyTagGroups'
import { satisfiesFilter } from './satisfiesFilter'
import { useGroupCollapse } from './useGroupCollapse'

const DropIndicator = styled(Box, { shouldForwardProp: (prop) => prop !== 'showIndicator' })<
  BoxProps & { showIndicator: boolean }
>(({ showIndicator, theme }) =>
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
  const { isCollapsed, toggleGroupCollapse } = useGroupCollapse()
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
    return <EmptyTagGroups />
  }

  return (
    <Stack height="100%" gap={2} justifyContent="space-between">
      <Stack
        gap={1}
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
        <Stack direction="row" alignItems="center">
          <SearchBar value={filter} onChange={setFilter} />
          <IconButton></IconButton>
        </Stack>
        {groups
          ?.filter(
            (g) =>
              (g.tags?.length == 0 && !filter) || g.tags?.some((t) => satisfiesFilter(t, filter))
          )
          .map((g) => (
            <Droppable
              key={g.id}
              id={g.id}
              type="tagGroup"
              hideIndicator
              render={({ overType }) => (
                <DropIndicator showIndicator={overType === 'tagGroup'}>
                  <Draggable type="tagGroup" id={g.id} exposeHandle>
                    <TagGroup
                      group={g}
                      selectedTags={selection}
                      filter={filter}
                      onSelect={selectItem}
                      collapsed={isCollapsed(g.id)}
                      onToggleCollapse={() => toggleGroupCollapse(g.id)}
                    />
                  </Draggable>
                </DropIndicator>
              )}
            />
          ))}

        <Droppable
          type="tagGroup"
          id={-1}
          hideIndicator
          render={({ overType }) => (
            <DropIndicator showIndicator={overType === 'tagGroup'}>
              <Button
                onClick={async () => {
                  await window.tagApi.createGroup()
                  reload()
                }}
                fullWidth
              >
                <AddIcon />
              </Button>
            </DropIndicator>
          )}
        />
      </Stack>
      {(selection?.length ?? 0) > 0 && (
        <Box position={'sticky'} bgcolor="background.paper" bottom={0} pb={2}>
          <Divider />
          <TagSelection
            selection={selection}
            onClick={selectItem}
            onClear={() => onChange && onChange([])}
          />
        </Box>
      )}
    </Stack>
  )
}
