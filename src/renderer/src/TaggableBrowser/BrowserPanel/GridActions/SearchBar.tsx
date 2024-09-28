import { TextField, Box, IconButton } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface SearchBarProps {}

export function SearchBar({}: SearchBarProps) {
  const {
    fetchOptions: { search },
    setFetchOptions
  } = useTaggables()

  return (
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
  )
}
