import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select
} from '@mui/material'
import { useDirectories } from '@renderer/EntityProviders/DirectoryProvider'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface DirectorySelectorProps {}

const LABEL_ID = 'directory-selector-label'

export function DirectorySelector({}: DirectorySelectorProps) {
  const { data: directories } = useDirectories()
  const { fetchOptions, setFetchOptions } = useTaggables()

  console.log(directories, fetchOptions.directories)

  return (
    <FormControl size="small" sx={{ width: 200 }}>
      <InputLabel id={LABEL_ID}>Directories</InputLabel>
      <Select
        labelId={LABEL_ID}
        multiple
        value={fetchOptions.directories ?? []}
        onChange={(e) =>
          setFetchOptions({ directories: typeof e.target.value === 'string' ? [] : e.target.value })
        }
        input={<OutlinedInput label="Directories" />}
        renderValue={(selected) =>
          selected.length === 1 ? selected[0] : `${selected.length} Directories`
        }
      >
        {directories?.map((d) => (
          <MenuItem key={d.path} value={d.path}>
            <Checkbox checked={fetchOptions.directories?.includes(d.path)} />
            <ListItemText primary={d.path} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
