import { TextField, Box, IconButton, Stack } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

export interface SearchBarProps {
  value?: string
  onChange?: (value?: string) => void
  endAdornment?: React.ReactNode
}

export function SearchBar({ value, onChange, endAdornment }: SearchBarProps) {
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
            <Stack direction="row" alignItems={'center'} gap={1}>
              <IconButton
                size="small"
                onClick={() => onChange && onChange(undefined)}
                sx={{ transition: '0.15s', opacity: value ? 1 : 0 }}
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
              {endAdornment}
            </Stack>
          )
        }
      }}
    />
  )
}
