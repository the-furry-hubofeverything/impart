import { TextField, Box, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

export interface SearchBarProps {
  value?: string
  onChange?: (value?: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      placeholder="Search"
      size="small"
      fullWidth
      value={value ?? ''}
      onChange={(e) => onChange && onChange(e.currentTarget.value)}
      slotProps={{
        input: {
          startAdornment: (
            <Box mr={0.5} mt={1} ml={-0.5}>
              <SearchIcon color="secondary" />
            </Box>
          ),
          endAdornment: (
            <IconButton size="small" onClick={() => onChange && onChange(undefined)}>
              <ClearIcon fontSize="inherit" />
            </IconButton>
          )
        }
      }}
    />
  )
}
