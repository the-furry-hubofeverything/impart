import { Box, Button, IconButton, List, ListItem, ListItemText } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useDirectories } from './EntityProviders/DirectoryProvider'
import { useTaggables } from './EntityProviders/TaggableProvider'

export interface IndexedDirectoriesSettingsProps {
  onChange?: () => void
}

export function IndexedDirectoriesSettings({ onChange }: IndexedDirectoriesSettingsProps) {
  const { data: directories, executeRequest: reloadDirectories } = useDirectories()
  const { fetchAllTaggables } = useTaggables()

  const remove = async (path: string) => {
    await window.indexApi.deleteDirectory(path)
    fetchAllTaggables()
    reloadDirectories()
  }

  return (
    <Box minWidth={600}>
      <List dense>
        {directories?.map((d) => (
          <ListItem
            key={d.path}
            secondaryAction={
              <IconButton color="error" onClick={() => remove(d.path)}>
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
            await window.indexApi.selectAndIndexDirectory()
            onChange && onChange()
          }}
        >
          Add Folder
        </Button>
      </Box>
    </Box>
  )
}
