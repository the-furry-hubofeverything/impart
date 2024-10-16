import { ipcMain } from 'electron'
import { IndexingManager } from '../indexables/indexingManager'

export function setupFileApi() {
  ipcMain.on('file/openFile', (_e, id: number) => IndexingManager.openFile(id))
  ipcMain.on('file/openFileLocation', (_e, id: number) => IndexingManager.openFileLocation(id))
}
