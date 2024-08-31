import { ipcMain } from 'electron'
import { taggableManager } from '../tagging/taggableManager'
import { indexingManager } from '../indexables/indexingManager'

export function setupTaggableApi() {
  ipcMain.handle('taggable/getTaggables', (e, tagIds?: number[]) =>
    taggableManager.getTaggables(tagIds)
  )
  ipcMain.handle('taggable/selectAndIndexDirectory', () =>
    indexingManager.selectAndIndexDirectory()
  )
  ipcMain.handle('taggable/getDirectories', () => indexingManager.getIndexedDirectories())
}
