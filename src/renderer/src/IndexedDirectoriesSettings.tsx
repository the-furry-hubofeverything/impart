import { Box, Button, IconButton, List, ListItem, ListItemText } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'

export interface IndexedDirectoriesSettingsProps {
  directories?: Impart.IndexedDirectory[]
  onChange?: () => void
}

export function IndexedDirectoriesSettings({
  directories,
  onChange
}: IndexedDirectoriesSettingsProps) {
  return (
    <Box minWidth={600}>
      <List dense>
        {directories?.map((d) => (
          <ListItem
            key={d.path}
            secondaryAction={
              <IconButton color="error">
                <CloseIcon />
              </IconButton>
            }
          >
            <ListItemText>{d.path}</ListItemText>
          </ListItem>
        ))}
      </List>
      <Box>
        <Button
          startIcon={<CreateNewFolderIcon />}
          variant="contained"
          size="small"
          onClick={async () => {
            await window.fileApi.selectAndIndexDirectory()
            onChange && onChange()
          }}
        >
          Add Folder
        </Button>
      </Box>
    </Box>
  )
}
