import {
  ToggleButtonGroup,
  Tooltip,
  ToggleButton,
  Stack,
  IconButton,
  styled,
  toggleButtonGroupClasses,
  Box,
  TextField,
  MenuItem,
  Divider
} from '@mui/material'
import { useRef } from 'react'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import ClockIcon from '@mui/icons-material/AccessTime'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FolderIcon from '@mui/icons-material/Folder'
import { useImpartIpcData } from '@renderer/common/useImpartIpc'

const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: 7
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0
    }
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]: {
    marginLeft: -1,
    borderLeft: '1px solid transparent'
  }
}))

export interface GridActionsProps {
  groupByDirectory: boolean
  disableGrouping?: boolean
  onChange: (groupByDirectory: boolean) => void
}

export function GridActions({ groupByDirectory, onChange, disableGrouping }: GridActionsProps) {
  const {
    fetchOptions: { order, year, search },
    setFetchOptions
  } = useTaggables()

  const { data } = useImpartIpcData(() => window.taggableApi.getAllTaggableYears(), [])

  const toolbarRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <Stack
        flex={1}
        ref={toolbarRef}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
      >
        <Box flex={1}>
          <TextField
            placeholder="Search"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setFetchOptions({ search: e.currentTarget.value })}
            slotProps={{
              input: {
                startAdornment: (
                  <Box mr={0.5} mt={1} ml={-0.5}>
                    <SearchIcon color="secondary" />
                  </Box>
                ),
                endAdornment: (
                  <IconButton size="small" onClick={() => setFetchOptions({ search: '' })}>
                    <ClearIcon fontSize="inherit" />
                  </IconButton>
                )
              }
            }}
          />
        </Box>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <TextField
          select
          value={year ?? 'All'}
          label="Year"
          size="small"
          onChange={(e) =>
            setFetchOptions({ year: e.target.value === 'All' ? undefined : Number(e.target.value) })
          }
          slotProps={{
            select: { MenuProps: { slotProps: { paper: { sx: { maxHeight: 260 } } } } }
          }}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value={'All'}>All</MenuItem>
          {data?.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
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
              onChange(value === 'group')
            }}
            disabled={disableGrouping}
            sx={{ opacity: disableGrouping ? 0.6 : 1 }}
          >
            <ToggleButton value={'group'}>
              <FolderIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Tooltip>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <StyledToggleButtonGroup
          value={order}
          size="small"
          exclusive
          onChange={(e, value) => {
            if (value) {
              setFetchOptions({ order: value })
            }
          }}
        >
          <Tooltip title="Sort Alphabetically">
            <ToggleButton value={'alpha'}>
              <SortByAlphaIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Sort by Last Modified">
            <ToggleButton value={'date'}>
              <ClockIcon />
            </ToggleButton>
          </Tooltip>
        </StyledToggleButtonGroup>
      </Stack>
    </>
  )
}
