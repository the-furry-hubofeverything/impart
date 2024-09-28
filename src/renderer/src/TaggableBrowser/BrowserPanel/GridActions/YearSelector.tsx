import { TextField, MenuItem } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { useImpartIpcData } from '@renderer/common/useImpartIpc'

export interface YearSelectorProps {}

export function YearSelector({}: YearSelectorProps) {
  const {
    fetchOptions: { year },
    setFetchOptions
  } = useTaggables()

  const { data } = useImpartIpcData(() => window.taggableApi.getAllTaggableYears(), [])

  return (
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
  )
}
