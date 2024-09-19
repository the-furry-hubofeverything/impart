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
  ListItemText,
  Stack
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useDirectories } from '../EntityProviders/DirectoryProvider'
import { useTaggables } from '../EntityProviders/TaggableProvider'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { DirectoryEditor } from './DirectoryEditor'

export interface IndexedDirectoriesSettingsProps {
  onChange?: () => void
}

export function IndexedDirectoriesSettings({ onChange }: IndexedDirectoriesSettingsProps) {
  const { data: directories, executeRequest: reloadDirectories } = useDirectories()

  const [directoryState, setDirectoryState] = useState<Impart.Directory[]>()

  useEffect(() => {
    setDirectoryState(directories)
  }, [directories])

  const [targetForDeletion, setTargetForDeletion] = useState<Impart.CountedDirectory>()
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  return (
    <Box>
      <Stack gap={1}>
        {directoryState?.map((d) => <DirectoryEditor key={d.path} directory={d} />)}
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
      </Stack>
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
