import {
  ListSubheader,
  Checkbox,
  ListItemText,
  TextField,
  Box,
  Chip,
  SelectProps,
  MenuItem
} from '@mui/material'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { Tag } from '@renderer/Common/Components/Tag'
import React from 'react'

function flattenSelectOptions(groups: Impart.TagGroup[] | undefined, selected: number[]) {
  const items: React.ReactNode[] = []

  groups?.forEach((g) => {
    items.push(<ListSubheader key={`group-${g.id}`}>{g.label}</ListSubheader>)

    g.tags
      ?.sort((a, b) => a.tagOrder - b.tagOrder)
      .forEach((t) => {
        items.push(
          <MenuItem key={`tag-${t.id}`} value={t.id}>
            <Checkbox checked={selected.includes(t.id)} />
            <ListItemText>
              <Tag tag={t} />
            </ListItemText>
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

export interface TagMultiSelectProps {
  selection: number[]
  onChange?: (selection: number[]) => void
}

export function TagMultiSelect({ selection, onChange }: TagMultiSelectProps) {
  const { groups } = useTagGroups()

  return (
    <TextField
      label="Auto-Tags"
      select
      slotProps={{
        //@ts-expect-error SelectProps only allows "unknown" value types, but this has a number[]
        select: {
          multiple: true,
          value: selection,
          onChange: (e) =>
            onChange && onChange(typeof e.target.value === 'string' ? [] : e.target.value),
          renderValue: (selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const tag = findTag(value, groups)

                return tag ? (
                  <Tag key={tag.id} tag={tag} size="small" />
                ) : (
                  <Chip key={null} title="Unknown" size="small" />
                )
              })}
            </Box>
          ),
          MenuProps: { slotProps: { paper: { sx: { maxHeight: 400 } } } }
        } satisfies SelectProps<number[]>
      }}
      sx={{ minWidth: 300 }}
    >
      {flattenSelectOptions(groups, selection)}
    </TextField>
  )
}
