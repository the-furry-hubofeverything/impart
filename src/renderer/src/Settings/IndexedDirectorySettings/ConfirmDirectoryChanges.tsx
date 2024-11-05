import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography
} from '@mui/material'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React from 'react'
import SaveIcon from '@mui/icons-material/SaveRounded'

export interface ConfirmDirectoryChangesProps {
  directoryState: Impart.Directory[]
  onSave?: () => void
}

export function ConfirmDirectoryChanges({ directoryState, onSave }: ConfirmDirectoryChangesProps) {
  //This api call is very expensive so we only want to call it while the modal's open
  const { data: indexChanges, isLoading } = useImpartIpcData(
    async () => window.indexApi.calculateTotalIndexChanges(directoryState),
    [directoryState]
  )

  const boldOrLoad = (value?: number) =>
    isLoading ? (
      <CircularProgress size={16} sx={{ marginX: 0.5 }} />
    ) : (
      <Typography component="span" fontWeight="bold">
        {value}
      </Typography>
    )

  return (
    <>
      <DialogTitle>Save Directories?</DialogTitle>
      <DialogContent>
        These changes will load an additional {boldOrLoad(indexChanges?.additions)} files and remove{' '}
        {boldOrLoad(indexChanges?.removals)} files
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onSave} startIcon={<SaveIcon />}>
          Save
        </Button>
      </DialogActions>
    </>
  )
}
