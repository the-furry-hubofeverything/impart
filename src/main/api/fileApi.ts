import { ipcMain } from 'electron'
import { indexingManager } from '../indexables/indexingManager'

export function setupFileApi() {
  ipcMain.handle('file/getThumbnail', (_e, imageId: number) =>
    indexingManager.getThumbnail(imageId)
  )
  ipcMain.on('file/openFile', (_e, id: number) => indexingManager.openFile(id))
}
