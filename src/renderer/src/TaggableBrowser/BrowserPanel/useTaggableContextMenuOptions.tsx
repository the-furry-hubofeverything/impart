import { ContextMenuOption } from '@renderer/Common/Components/ContextMenu/ContextMenu'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import FolderIcon from '@mui/icons-material/Folder'
import TagIcon from '@mui/icons-material/LocalOffer'
import BrushIcon from '@mui/icons-material/Brush'
import { isTaggableImage, isTaggableStack } from '@renderer/Common/taggable'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import BurstModeIcon from '@mui/icons-material/BurstMode'
import HideImageIcon from '@mui/icons-material/HideImage'
import ImageIcon from '@mui/icons-material/Image'
import { useConfirmationDialog } from '@renderer/Common/Components/ConfirmationDialogProvider'
import { useImpartIpcCall } from '@renderer/Common/Hooks/useImpartIpc'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import CancelIcon from '@mui/icons-material/Cancel'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'

export interface TaggableGridEvents {
  onEditTags?: (taggable: Impart.Taggable) => void
  onBulkTag?: (taggables: Impart.Taggable[]) => void
  onCreateStack?: (taggables: Impart.Taggable[]) => void
  onOpenStack?: (taggable: Impart.TaggableStack) => void
  onRenameStack?: (taggable: Impart.TaggableStack) => void
  onHide?: (taggable: Impart.Taggable[]) => void
}

export function useTaggableContextMenuOptions(
  selection: Impart.Taggable[],
  { onEditTags, onBulkTag, onCreateStack, onOpenStack, onHide, onRenameStack }: TaggableGridEvents
): (ContextMenuOption | 'divider')[] {
  const confirm = useConfirmationDialog()
  const { callIpc: removeStack } = useImpartIpcCall(window.stackApi.remove, [])
  const { callIpc: setCover } = useImpartIpcCall(window.stackApi.setCover, [])

  const { reload, stackTrail } = useTaggables()

  let selectedImage: Impart.TaggableImage | undefined = undefined

  if (selection.length > 0 && isTaggableImage(selection[0])) {
    selectedImage = selection[0]
  }

  return [
    {
      icon: <FileOpenIcon />,
      label: 'Open',
      disabled: selection.length > 1,
      onClick: () =>
        selection.length == 1 && isTaggableStack(selection[0])
          ? onOpenStack && onOpenStack(selection[0])
          : window.fileApi.openFile(selection[0].id)
    },
    {
      icon: <FolderIcon />,
      label: 'Open File Location',
      disabled: selection.length > 1,
      hide: selection.length != 0 && isTaggableStack(selection[0]),
      onClick: () => window.fileApi.openFileLocation(selection[0].id)
    },
    {
      icon: <BrushIcon />,
      label: 'Open Source',
      disabled: !selectedImage || selectedImage.source == null,
      hide: selection.length != 0 && isTaggableStack(selection[0]),
      onClick: () => window.fileApi.openFile(selectedImage!.source!.id)
    },
    'divider',
    {
      icon: <TagIcon />,
      label: 'Edit Tags',
      hide: selection.length > 1,
      onClick: () => onEditTags && onEditTags(selection[0])
    },
    {
      icon: <BookmarksIcon />,
      label: 'Bulk Tag',
      hide: selection.length < 2,
      onClick: () => onBulkTag && onBulkTag(selection)
    },
    'divider',
    {
      icon: <BurstModeIcon />,
      label: 'Create Stack',
      hide: selection.length < 2,
      onClick: () => onCreateStack && onCreateStack(selection)
    },
    {
      icon: <DriveFileRenameOutlineIcon />,
      label: 'Rename Stack',
      hide: selection.length !== 1 || !isTaggableStack(selection[0]),
      onClick: () => onRenameStack && isTaggableStack(selection[0]) && onRenameStack(selection[0])
    },
    {
      icon: <ImageIcon />,
      label: 'Set as Stack Cover',
      disabled: selection.length > 0 && !isTaggableImage(selection[0]),
      hide: selection.length !== 1 || stackTrail.length === 0,
      onClick: () => setCover(stackTrail[stackTrail.length - 1].id, selection[0].id)
    },
    {
      icon: <CancelIcon />,
      label: 'Explode Stack',
      hide: selection.length !== 1 || !isTaggableStack(selection[0]),
      danger: true,
      onClick: () =>
        confirm(
          {
            title: 'Explode Stack?',
            body: 'All items within the stack will be merged into the current view.',
            confirmIcon: <CancelIcon />,
            danger: true,
            confirmText: 'Explode'
          },
          async () => {
            if (selection.length === 1) {
              await removeStack(selection[0].id)
              reload()
            }
          }
        )
    },
    'divider',
    {
      icon: <HideImageIcon />,
      label: 'Hide',
      onClick: () => onHide && onHide(selection)
    }
  ]
}
