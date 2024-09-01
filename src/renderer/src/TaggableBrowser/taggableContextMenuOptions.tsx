import { ContextMenuOption } from '@renderer/common/ContextMenu/ContextMenu'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import TagIcon from '@mui/icons-material/LocalOffer'
import BrushIcon from '@mui/icons-material/Brush'
import { isTaggableImage } from '@renderer/common/taggable'

export function getTaggableContextMenuOptions(
  selection: Impart.Taggable[],
  onEditTags?: (target: Impart.Taggable) => void
): (ContextMenuOption | 'divider')[] {
  let selectedImage: Impart.TaggableImage | undefined = undefined

  if (selection.length > 0 && isTaggableImage(selection[0])) {
    selectedImage = selection[0]
  }

  return [
    {
      icon: <FileOpenIcon />,
      label: 'Open',
      disabled: selection.length > 1,
      onClick: () => window.fileApi.openFile(selection[0].id)
    },
    {
      icon: <BrushIcon />,
      label: 'Open Source',
      disabled: !selectedImage || selectedImage.source == null,
      onClick: () => window.fileApi.openFile(selectedImage!.source!.id)
    },
    'divider',
    {
      icon: <TagIcon />,
      label: 'Edit Tags',
      disabled: selection.length > 1,
      onClick: () => onEditTags && onEditTags(selection[0])
    }
  ]
}
