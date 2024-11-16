import { Stack, Typography, Grid2 } from '@mui/material'
import { Tag } from '../Tag/Tag'

export interface EditTagsProps {
  tags: Impart.Tag[]
  removeTag?: (t: Impart.Tag) => void
}

export function EditTags({ tags, removeTag }: EditTagsProps) {
  return (
    <Stack p={2} gap={2}>
      <Typography textAlign="center" variant="h6">
        Tags
      </Typography>
      {tags.length > 0 && (
        <Grid2 container maxWidth={360} spacing={1} justifyContent={'center'}>
          {tags.map((t) => (
            <Grid2 key={t.id}>
              <Tag tag={t} onClick={() => removeTag && removeTag(t)} />
            </Grid2>
          ))}
        </Grid2>
      )}
      {tags.length == 0 && (
        <Typography color="text.secondary" textAlign="center" fontStyle="italic" variant="body2">
          Untagged
        </Typography>
      )}
    </Stack>
  )
}
