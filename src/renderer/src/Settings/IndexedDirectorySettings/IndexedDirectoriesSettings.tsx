import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'
import { useDirectories } from '../../EntityProviders/DirectoryProvider'
import { useEffect, useState } from 'react'
import { DirectoryList } from './DirectoryList'
import { produce } from 'immer'
import SaveIcon from '@mui/icons-material/Save'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TaskStatus } from '@renderer/Common/Components/TaskStatus'
import { useTaskStatus } from '@renderer/TaskStatusProvider'
import { AddDirectory } from './AddDirectory'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { ConfirmDirectoryChanges } from './ConfirmDirectoryChanges'
import ConfirmIcon from '@mui/icons-material/Check'

export interface IndexedDirectoriesSettingsProps {}

export function IndexedDirectoriesSettings({}: IndexedDirectoriesSettingsProps) {
  const { data: originalDirectories, reload: reloadDirectories } = useDirectories()
  const { reload: fetchTaggables } = useTaggables()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setSaving] = useState(false)

  const { isTaskRunning } = useTaskStatus()

  const [directoryState, setDirectoryState] = useState<Impart.Directory[]>([])

  useEffect(() => {
    setDirectoryState(originalDirectories ?? [])
  }, [originalDirectories])

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
        <AddDirectory
          directoryState={directoryState}
          onAdd={(folder) =>
            setDirectoryState(
              produce(directoryState, (next) => {
                next.push({ path: folder, autoTags: [], recursive: false })
              })
            )
          }
        />
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
            startIcon={<ConfirmIcon />}
            variant="contained"
            size="large"
            onClick={() => setShowSaveDialog(true)}
            disabled={isTaskRunning}
          >
            Confirm
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
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <ConfirmDirectoryChanges
          directoryState={directoryState}
          onSave={() => {
            saveChanges()
            setShowSaveDialog(false)
          }}
        />
      </Dialog>
    </Box>
  )
}
