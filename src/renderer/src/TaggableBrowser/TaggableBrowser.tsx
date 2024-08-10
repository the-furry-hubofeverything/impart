import { Stack, Box, Collapse, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TaggableGrid } from './TaggableGrid'
import { SettingsPanel } from './SettingsPanel'
import { TaggingPanel } from './TaggingPanel'
import { useTaggables } from '@renderer/TaggableProvider'
import { IndexingPanel } from './IndexingPanel'
import { useMultiSelection } from '@renderer/common/useMultiSelection'
import { useContextMenu } from '@renderer/common/useContextMenu'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import TagIcon from '@mui/icons-material/LocalOffer'

export interface TaggableBrowserProps {
  onSettingsPressed?: (button: 'directories') => void
  onEditTags?: (file: Impart.Taggable) => void
}

export function TaggableBrowser({ onSettingsPressed, onEditTags }: TaggableBrowserProps) {
  const { anchorPosition, closeMenu, open: menuOpen, handleContextMenu } = useContextMenu()
  const { fetchAllTaggables, ready, taggables, isIndexing } = useTaggables()
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

  return (
    <>
      <Stack direction="row" p={1} gap={1} height="100vh">
        <Stack flex={1} overflow="auto" pr={1} gap={2}>
          <Stack position="sticky" top={4}></Stack>
          <Box flex={1}>
            <TaggableGrid
              taggables={taggables}
              selection={selection}
              onSelect={selectItem}
              onRightClick={(image, e) => {
                if (!itemIsSelected(image)) {
                  selectItem(image)
                }

                handleContextMenu(e)
              }}
            />
          </Box>
        </Stack>
        <Box minWidth={300} flex={0.25}>
          <Stack width="100%" height="100%">
            <TaggingPanel />
            <Collapse in={isIndexing}>
              <Box pt={2}>
                <IndexingPanel />
              </Box>
            </Collapse>
            <Box pt={2}>
              <SettingsPanel onClick={(b) => onSettingsPressed && onSettingsPressed(b)} />
            </Box>
          </Stack>
        </Box>
      </Stack>
      <Menu
        open={menuOpen}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
      >
        <MenuItem
          onClick={() => {
            window.fileApi.openFile(selection[0].id)
            closeMenu()
          }}
          disabled={selection.length > 1}
        >
          <ListItemIcon>
            <FileOpenIcon />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditTags && onEditTags(selection[0])
            closeMenu()
          }}
          disabled={selection.length > 1}
        >
          <ListItemIcon>
            <TagIcon />
          </ListItemIcon>
          <ListItemText>Edit Tags</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
