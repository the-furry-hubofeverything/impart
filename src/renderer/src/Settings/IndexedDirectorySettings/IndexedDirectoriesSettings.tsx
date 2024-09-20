import { Box, Button, CircularProgress, Stack } from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useDirectories } from '../../EntityProviders/DirectoryProvider'
import { useEffect, useState } from 'react'
import { DirectoryList } from './DirectoryList'
import { produce } from 'immer'
import SaveIcon from '@mui/icons-material/Save'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface IndexedDirectoriesSettingsProps {
  onChange?: () => void
}

export function IndexedDirectoriesSettings({ onChange }: IndexedDirectoriesSettingsProps) {
  const { data: originalDirectories, executeRequest: reloadDirectories } = useDirectories()
  const { fetchTaggables } = useTaggables()
  const [isSaving, setSaving] = useState(false)

  const [directoryState, setDirectoryState] = useState<Impart.Directory[]>([])

  useEffect(() => {
    setDirectoryState(originalDirectories ?? [])
  }, [originalDirectories])

  const addDirectory = async () => {
    const folder = await window.indexApi.selectDirectory()

    if (folder != null) {
      setDirectoryState(
        produce(directoryState, (next) => {
          next.push({ path: folder })
        })
      )
    }
  }

  const saveChanges = async () => {
    setSaving(true)
    await window.indexApi.updateDirectories(directoryState)
    setSaving(false)
    reloadDirectories()
    fetchTaggables()
  }

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
          onClick={addDirectory}
        >
          Add Directory
        </Button>
      </Stack>
      <Box pt={2} textAlign="right">
        {isSaving && <CircularProgress />}
        {!isSaving && (
          <Button startIcon={<SaveIcon />} variant="contained" size="large" onClick={saveChanges}>
            Save
          </Button>
        )}
      </Box>
    </Box>
  )
}
