import { ipcMain } from 'electron'
import { tagManager } from '../tagging/tagManager'

export function setupTagApi() {
  ipcMain.handle('tag/getGroups', () => tagManager.getTagGroups())

  ipcMain.handle('tag/editFileTags', (e, fileId: number, tagIds: number[]) =>
    tagManager.setFileTags(fileId, tagIds)
  )
}
