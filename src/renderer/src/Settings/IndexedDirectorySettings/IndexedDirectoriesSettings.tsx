import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack
} from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useDirectories } from '../../EntityProviders/DirectoryProvider'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { DirectoryList } from './DirectoryList'

export interface IndexedDirectoriesSettingsProps {
  onChange?: () => void
}

export function IndexedDirectoriesSettings({ onChange }: IndexedDirectoriesSettingsProps) {
  const { data: originalDirectories } = useDirectories()

  const [directoryState, setDirectoryState] = useState<Impart.Directory[]>([])

  useEffect(() => {
    setDirectoryState(originalDirectories ?? [])
  }, [originalDirectories])

  const [targetForDeletion, setTargetForDeletion] = useState<Impart.CountedDirectory>()
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  return (
    <Box>
      <Stack gap={1}>
        <DirectoryList
          directoryState={directoryState}
          originalDirectories={originalDirectories}
          onChange={(s) => setDirectoryState(s)}
        />
        <Button
          startIcon={<CreateNewFolderIcon />}
          variant="outlined"
          size="large"
          onClick={async () => {
            await window.indexApi.selectAndIndexDirectory()
            onChange && onChange()
          }}
        >
          Add Directory
        </Button>
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
