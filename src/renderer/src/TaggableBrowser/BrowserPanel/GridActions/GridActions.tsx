import {
  Stack,
  IconButton,
  styled,
  Box,
  Divider,
  Collapse,
  Breadcrumbs,
  Chip,
  emphasize,
  Popover
} from '@mui/material'
import { YearSelector } from './YearSelector'
import { SortButtons } from './SortButtons'
import { SearchBar } from '../../../Common/Components/SearchBar'
import HomeIcon from '@mui/icons-material/Home'
import { Droppable } from '@renderer/Common/Components/DragAndDrop/Droppable'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import FilterIcon from '@mui/icons-material/FilterAlt'
import { useRef, useState } from 'react'

const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: 7
}))

export interface GridActionsProps {
  stack: Impart.TaggableStack[]
  onStackChange: (stack: Impart.TaggableStack[]) => void
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.secondary.light
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.primary.dark,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06)
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12)
    },
    '& .MuiChip-icon': {
      color: theme.palette.primary.dark
    }
  }
}) as typeof Chip // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

export function GridActions({ stack, onStackChange }: GridActionsProps) {
  const {
    fetchOptions: { search, year },
    setFetchOptions
  } = useTaggables()

  const [showFilters, setShowFilters] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  return (
    <Box width="100%">
      <Stack
        flex={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
        divider={<Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />}
      >
        <Box flex={1} ref={anchorRef}>
          {__APP_VERSION__}
          <SearchBar
            value={search}
            onChange={(v) => setFetchOptions({ search: v })}
            endAdornment={
              <>
                {year && (
                  <Chip
                    label={year}
                    size="small"
                    onDelete={() => setFetchOptions({ year: undefined })}
                  />
                )}
                <IconButton size="small" onClick={() => setShowFilters(true)}>
                  <FilterIcon fontSize="inherit" />
                </IconButton>
              </>
            }
          />
        </Box>
        <SortButtons />
        <Popover
          open={showFilters}
          onClose={() => setShowFilters(false)}
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: -10,
            horizontal: 'right'
          }}
        >
          <Box p={2}>
            <YearSelector />
          </Box>
        </Popover>
      </Stack>
      <Collapse in={stack.length > 0}>
        <Box pt={1}>
          <Breadcrumbs>
            <Droppable
              type="home"
              id={-1}
              render={() => (
                <StyledBreadcrumb
                  label="Home"
                  icon={<HomeIcon />}
                  onClick={() => onStackChange([])}
                />
              )}
            />
            {stack.map((s, index) => (
              <Droppable
                type="taggable"
                id={s.id}
                render={() => (
                  <StyledBreadcrumb
                    key={s.id}
                    label={s.name}
                    onClick={() => onStackChange(stack.slice(0, index + 1))}
                  />
                )}
              />
            ))}
          </Breadcrumbs>
        </Box>
      </Collapse>
    </Box>
  )
}
