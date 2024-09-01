import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useDirectories } from '../EntityProviders/DirectoryProvider'
import { useTaggables } from '../EntityProviders/TaggableProvider'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

export interface IndexedDirectoriesSettingsProps {
  onChange?: () => void
}

export function IndexedDirectoriesSettings({ onChange }: IndexedDirectoriesSettingsProps) {
  const { data: directories, executeRequest: reloadDirectories } = useDirectories()
  const { startNewFetch } = useTaggables()

  const [targetForDeletion, setTargetForDeletion] = useState<Impart.CountedDirectory>()
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const remove = async (path: string) => {
    await window.indexApi.deleteDirectory(path)
    startNewFetch()
    reloadDirectories()
  }

  return (
    <Box minWidth={600}>
      <List dense>
        {directories?.map((d) => (
          <ListItem
            key={d.path}
            secondaryAction={
              <IconButton
                color="error"
                onClick={() => {
                  setShowDeleteWarning(true)
                  setTargetForDeletion(d)
                }}
              >
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
      <Dialog open={showDeleteWarning} onClose={() => setShowDeleteWarning(false)}>
        <DialogTitle>Remove Directory</DialogTitle>
        <DialogContent>
          All {targetForDeletion?.taggableCount} files in this directory will be untagged and
          removed from Impart
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteWarning(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (targetForDeletion) {
                remove(targetForDeletion.path)
                setTargetForDeletion(undefined)
                setShowDeleteWarning(false)
              }
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
