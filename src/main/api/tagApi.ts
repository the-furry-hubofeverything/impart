import { ipcMain } from 'electron'
import { tagManager } from '../tagManager'

export function setupTagApi() {
  ipcMain.handle('tag/getGroups', () => tagManager.getTagGroups())
}
