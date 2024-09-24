import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  TextField,
  Tooltip
} from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { Tag } from '@renderer/common/Tag'
import { DeletedDirectory } from './DeletedDirectory'

function flattenSelectOptions(groups?: Impart.TagGroup[]) {
  const items: React.ReactNode[] = []

  groups?.forEach((g) => {
    items.push(<ListSubheader key={`group-${g.id}`}>{g.label}</ListSubheader>)

    g.tags?.forEach((t) => {
      items.push(
        <MenuItem key={`tag-${t.id}`} value={t.id}>
          <Tag tag={t} />
        </MenuItem>
      )
    })
  })

  return items
}

function findTag(tagId: number, groups?: Impart.TagGroup[]) {
  if (groups == null) {
    return
  }

  for (const group of groups) {
    const tag = group.tags?.find((t) => t.id === tagId)

    if (tag) {
      return tag
    }
  }
}

function isDifferent(first?: Impart.Directory, second?: Impart.Directory) {
  return (first == null) != (second == null)
}

export interface DirectoryEditorProps {
  directoryState?: Impart.Directory
  originalDirectory?: Impart.Directory
  onChange?: (state: Partial<Impart.Directory>) => void
  onDelete?: () => void
  onRestore?: () => void
}

export function DirectoryEditor({
  directoryState,
  originalDirectory,
  onChange,
  onDelete,
  onRestore
}: DirectoryEditorProps) {
  const { groups } = useTagGroups()

  if (directoryState == null) {
    return <DeletedDirectory directory={originalDirectory} onRestore={onRestore} />
  }

  return (
    <Card sx={{ bgcolor: '#fff' }}>
      <CardHeader
        title={
          <>
            {directoryState.path}{' '}
            {!originalDirectory && (
              <Tooltip title="Newly added directory">
                <AutoAwesomeIcon color="info" />
              </Tooltip>
            )}
          </>
        }
        action={
          <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent>
        <TextField
          label="Auto-Tags"
          select
          slotProps={{
            //@ts-expect-error SelectProps only allows "unknown" value types, but this has a number[]
            select: {
              multiple: true,
              value: directoryState.autoTags,
              onChange: (e) =>
                onChange &&
                onChange({ autoTags: typeof e.target.value === 'string' ? [] : e.target.value }),
              renderValue: (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const tag = findTag(value, groups)

                    return tag ? <Tag tag={tag} /> : <Chip title="Unknown" />
                  })}
                </Box>
              )
            } satisfies SelectProps<number[]>
          }}
          sx={{ minWidth: 300 }}
        >
          {flattenSelectOptions(groups)}
        </TextField>
        {/* <FormControl>
          <InputLabel>Auto Tags</InputLabel>
          <Select
            multiple
            value={directoryState.autoTags}
            onChange={(e) =>
              onChange &&
              onChange({ autoTags: typeof e.target.value === 'string' ? [] : e.target.value })
            }
            sx={{ minWidth: 200 }}
          >
            {flattenSelectOptions(groups)}
          </Select>
        </FormControl> */}
      </CardContent>
    </Card>
  )
}
