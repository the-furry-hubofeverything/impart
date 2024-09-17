import { ipcMain } from 'electron'
import { indexingManager } from '../indexables/indexingManager'
import { DirectoryManager, directoryManager } from '../indexables/directoryManager'

export function setupIndexApi() {
  ipcMain.handle('index/indexAll', () => indexingManager.indexAll())
  ipcMain.handle('index/selectAndIndexDirectory', () => directoryManager.selectAndIndexDirectory())
  ipcMain.handle('index/getDirectories', () => directoryManager.getIndexedDirectories())
  ipcMain.handle(
    'index/updateDirectories',
    (e, ...params: Parameters<InstanceType<typeof DirectoryManager>['updateDirectories']>) =>
      directoryManager.updateDirectories(...params)
  )
}
