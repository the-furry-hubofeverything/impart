import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Stack,
  Typography
} from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useDirectories } from '../../EntityProviders/DirectoryProvider'
import { useEffect, useState } from 'react'
import { DirectoryList } from './DirectoryList'
import { produce } from 'immer'
import SaveIcon from '@mui/icons-material/Save'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TaskStatus } from '@renderer/Common/Components/TaskStatus'
import { useTaskStatus } from '@renderer/TaskStatusProvider'

export interface IndexedDirectoriesSettingsProps {}

export function IndexedDirectoriesSettings({}: IndexedDirectoriesSettingsProps) {
  const { data: originalDirectories, reload: reloadDirectories } = useDirectories()
  const { fetchTaggables } = useTaggables()
  const [isSaving, setSaving] = useState(false)

  const { isTaskRunning } = useTaskStatus()

  const [directoryState, setDirectoryState] = useState<Impart.Directory[]>([])

  useEffect(() => {
    setDirectoryState(originalDirectories ?? [])
  }, [originalDirectories])

  const addDirectory = async () => {
    const folder = await window.indexApi.selectDirectory()

    if (folder != null) {
      setDirectoryState(
        produce(directoryState, (next) => {
          next.push({ path: folder, autoTags: [] })
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
      <Box mt={1} mb={2}>
        <Typography variant="h3">Directories</Typography>
      </Box>
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
      <Stack pt={2} direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
        {isTaskRunning && (
          <Typography variant="caption">
            Can't update directories while tasks are running
          </Typography>
        )}
        {isSaving && <CircularProgress />}
        {!isSaving && (
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            size="large"
            onClick={saveChanges}
            disabled={isTaskRunning}
          >
            Save
          </Button>
        )}
      </Stack>
      <Collapse in={isTaskRunning}>
        <Stack pt={2} alignItems="flex-end">
          <Box width={300}>
            <TaskStatus />
          </Box>
        </Stack>
      </Collapse>
    </Box>
  )
}
