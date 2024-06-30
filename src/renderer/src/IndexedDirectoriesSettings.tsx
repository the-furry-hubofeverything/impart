import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'

export interface IndexedDirectoriesSettingsProps {
  directories?: IndexedDirectory[]
}

export function IndexedDirectoriesSettings({ directories }: IndexedDirectoriesSettingsProps) {
  return (
    <Box minWidth={480}>
      <List>
        {directories?.map((d) => (
          <ListItem
            key={d.path}
            secondaryAction={
              <IconButton color="error">
                <RemoveIcon />
              </IconButton>
            }
          >
            <ListItemText>{d.path}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
