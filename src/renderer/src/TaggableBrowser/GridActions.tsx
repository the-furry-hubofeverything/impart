import {
  ToggleButtonGroup,
  Tooltip,
  ToggleButton,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  IconButton,
  styled,
  toggleButtonGroupClasses,
  Divider,
  Popover,
  Box,
  TextField
} from '@mui/material'
import React, { useRef, useState } from 'react'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import ClockIcon from '@mui/icons-material/AccessTime'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

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

export interface GridActionsProps {}

export function GridActions({}: GridActionsProps) {
  const {
    fetchOptions: { order, search },
    setFetchOptions
  } = useTaggables()

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
            InputProps={{
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
            }}
          />
        </Box>

        {/* <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} /> */}
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
