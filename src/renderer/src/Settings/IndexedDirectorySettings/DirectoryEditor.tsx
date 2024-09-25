import { Card, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { DeletedDirectory } from './DeletedDirectory'
import EmergencyIcon from '@mui/icons-material/Emergency'
import UndoIcon from '@mui/icons-material/Undo'
import { TagMultiSelect } from './TagMultiSelect'

function isDifferent(first: Impart.Directory, second: Impart.Directory) {
  return first.autoTags.slice().sort().join(',') !== second.autoTags.slice().sort().join(',')
}

export interface DirectoryEditorProps {
  directoryState?: Impart.Directory
  originalDirectory?: Impart.Directory
  onChange?: (state: Partial<Impart.Directory>) => void
  onDelete?: () => void
  onRestore?: () => void
}

export function DirectoryEditor({
  directoryState,
  originalDirectory,
  onChange,
  onDelete,
  onRestore
}: DirectoryEditorProps) {
  if (directoryState == null) {
    return <DeletedDirectory directory={originalDirectory} onRestore={onRestore} />
  }

  const different = originalDirectory && isDifferent(directoryState, originalDirectory)

  return (
    <Card sx={{ bgcolor: '#fff' }}>
      <CardHeader
        title={
          <>
            {directoryState.path}{' '}
            {!originalDirectory && (
              <Tooltip title="Newly added directory">
                <AutoAwesomeIcon color="info" />
              </Tooltip>
            )}
            {different && (
              <Tooltip title="Modified">
                <EmergencyIcon color="info" />
              </Tooltip>
            )}
          </>
        }
        action={
          <>
            {different && (
              <IconButton onClick={onRestore}>
                <UndoIcon />
              </IconButton>
            )}
            <IconButton color="error" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        }
      />
      <CardContent>
        <TagMultiSelect
          selection={directoryState.autoTags}
          onChange={(s) => onChange && onChange({ autoTags: s })}
        />
      </CardContent>
    </Card>
  )
}
