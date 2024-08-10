import { ipcMain } from 'electron'
import { taggableManager } from '../tagging/taggableManager'

export function setupTaggableApi() {
  ipcMain.handle('taggable/getTaggables', (e, tagIds?: number[]) =>
    taggableManager.getTaggables(tagIds)
  )
  ipcMain.handle('taggable/selectAndIndexDirectory', () =>
    taggableManager.selectAndIndexDirectory()
  )
  ipcMain.handle('taggable/getDirectories', () => taggableManager.getIndexedDirectories())
}
