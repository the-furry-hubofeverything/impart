import {
  Tooltip,
  ToggleButton,
  Stack,
  IconButton,
  styled,
  Box,
  Divider,
  Collapse,
  Breadcrumbs,
  Link,
  Chip,
  emphasize
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { YearSelector } from './YearSelector'
import { StyledToggleButtonGroup } from './StyledToggleButtonGroup'
import { SortButtons } from './SortButtons'
import { SearchBar } from './SearchBar'
import HomeIcon from '@mui/icons-material/Home'

const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: 7
}))

export interface GridActionsProps {
  groupByDirectory: boolean
  disableGrouping?: boolean
  stack: Impart.TaggableStack[]
  onGroupChange: (groupByDirectory: boolean) => void
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

export function GridActions({
  groupByDirectory,
  onGroupChange,
  disableGrouping,
  stack,
  onStackChange
}: GridActionsProps) {
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
        <Box flex={1}>
          <SearchBar />
        </Box>
        <YearSelector />
        <Tooltip
          title={
            disableGrouping
              ? 'Grouping is disabled when there are over 1000 items'
              : 'Group by Directory'
          }
        >
          <StyledToggleButtonGroup
            value={groupByDirectory ? 'group' : null}
            size="small"
            exclusive
            onChange={(e, value) => {
              onGroupChange(value === 'group')
            }}
            disabled={disableGrouping}
            sx={{ opacity: disableGrouping ? 0.6 : 1 }}
          >
            <ToggleButton value={'group'}>
              <FolderIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Tooltip>
        <SortButtons />
      </Stack>
      <Collapse in={stack.length > 0}>
        <Box pt={1}>
          <Breadcrumbs>
            <StyledBreadcrumb label="Home" icon={<HomeIcon />} onClick={() => onStackChange([])} />
            {stack.map((s, index) => (
              <StyledBreadcrumb
                key={s.id}
                label={s.name}
                onClick={() => onStackChange(stack.slice(0, index + 1))}
              />
            ))}
          </Breadcrumbs>
        </Box>
      </Collapse>
    </Box>
  )
}
