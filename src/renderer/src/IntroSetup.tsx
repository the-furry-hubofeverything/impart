import {
  Stack,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  FormControl,
  FormLabel
} from '@mui/material'
import { useState } from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolderRounded'
import FolderIcon from '@mui/icons-material/FolderRounded'
import CheckIcon from '@mui/icons-material/CheckRounded'
import { useImpartIpcCall, useImpartIpcData } from './Common/Hooks/useImpartIpc'

export interface IntroSetupProps {
  reload: () => void
}

export function IntroSetup({ reload }: IntroSetupProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>()
  const [recursive, setRecursive] = useState<boolean>()

  const { callIpc: getStarted, isLoading: gettingStarted } = useImpartIpcCall(
    () =>
      window.indexApi.updateDirectories([
        { path: selectedFolder ?? '', autoTags: [], recursive: recursive === true }
      ]),
    [selectedFolder, recursive]
  )

  if (selectedFolder) {
    return (
      <Stack justifyContent="center" alignItems="center" gap={4} height="100vh">
        <Box textAlign="center">
          <Typography>Selected Folder:</Typography>
          <Paper sx={{ py: 2, px: 4 }}>
            <Typography variant="h4">
              <FolderIcon /> {selectedFolder}
            </Typography>
          </Paper>
        </Box>

        <FormControl>
          <FormLabel>Which files do you want to load?</FormLabel>
          <RadioGroup
            row
            value={recursive ? 'recursive' : recursive === false ? 'notRecursive' : undefined}
            onChange={(e, value) => setRecursive(value === 'recursive')}
            sx={{ gap: 4 }}
          >
            <FormControlLabel
              value="recursive"
              control={<Radio />}
              label="Load every file and every sub-folder too"
            />
            <FormControlLabel
              value="notRecursive"
              control={<Radio />}
              label="Only load the files, no sub-folders"
            />
          </RadioGroup>
        </FormControl>

        <Stack direction={'row'} gap={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={async () => {
              const path = await window.indexApi.selectDirectory()

              if (path) {
                setSelectedFolder(path)
              }
            }}
          >
            Load a different folder
          </Button>
          <Button
            startIcon={<CheckIcon />}
            variant="contained"
            disabled={recursive === undefined}
            size="large"
            onClick={async () => {
              await getStarted()
              reload()
            }}
          >
            Confirm
          </Button>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack justifyContent="center" alignItems="center" gap={2} height="100vh">
      <Typography textAlign="center" sx={{ opacity: 0.6 }}>
        Welcome to Impart! To get started, select a folder you'd like to organize.
      </Typography>
      <Button
        startIcon={<CreateNewFolderIcon />}
        variant="contained"
        onClick={async () => {
          const path = await window.indexApi.selectDirectory()

          if (path) {
            setSelectedFolder(path)
            // await window.indexApi.updateDirectories([{ path, autoTags: [], recursive: false }])
            // reload()
          }
        }}
      >
        Select Folder
      </Button>
    </Stack>
  )
}
