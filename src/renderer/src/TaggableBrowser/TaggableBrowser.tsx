import {
  Stack,
  Box,
  Collapse,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TaggableGrid } from './TaggableGrid'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { IndexingPanel } from './IndexingPanel'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { useContextMenu } from '@renderer/common/ContextMenu/useContextMenu'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import TagIcon from '@mui/icons-material/LocalOffer'
import { ContextMenu } from '@renderer/common/ContextMenu'
import { isTaggableFile, isTaggableImage } from '@renderer/common/taggable'
import BrushIcon from '@mui/icons-material/Brush'

export interface TaggableBrowserProps {
  onSettingsPressed?: () => void
  onEditTags?: (file: Impart.Taggable) => void
}

export function TaggableBrowser({ onSettingsPressed, onEditTags }: TaggableBrowserProps) {
  const { fetchAllTaggables, ready, taggables, isIndexing } = useTaggables()
  const [showIndexingPanel, setShowIndexingPanel] = useState(false)

  useEffect(() => {
    if (isIndexing) {
      setShowIndexingPanel(true)
    } else {
      const timer = setTimeout(() => setShowIndexingPanel(false), 3000)

      return () => clearTimeout(timer)
    }
  }, [isIndexing])

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { selectItem, itemIsSelected } = useMultiSelection(
    taggables,
    selection,
    setSelection,
    (a, b) => a.id === b.id
  )

  useEffect(() => {
    if (ready) {
      fetchAllTaggables()
    }
  }, [fetchAllTaggables, ready])

  let selectedImage: Impart.TaggableImage | undefined = undefined

  if (selection.length > 0 && isTaggableImage(selection[0])) {
    selectedImage = selection[0]
  }

  return (
    <>
      <Stack direction="row" gap={1} height="100vh">
        <Stack overflow="auto" flex={1} pr={1} gap={2}>
          <ContextMenu
            flex={1}
            options={[
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
            ]}
          >
            <TaggableGrid
              taggables={taggables}
              selection={selection}
              onSelect={selectItem}
              onRightClick={(image, e) => {
                if (!itemIsSelected(image)) {
                  selectItem(image)
                }
              }}
            />
          </ContextMenu>
        </Stack>
        <Box minWidth={300} flex={0.25} py={1} pr={1}>
          <Stack width="100%" height="100%">
            <TaggingPanel />
            <Collapse in={showIndexingPanel}>
              <Box pt={2}>
                <IndexingPanel />
              </Box>
            </Collapse>
            <Box pt={2}>
              <SettingsPanel onClick={() => onSettingsPressed && onSettingsPressed()} />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
