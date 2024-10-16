import { ipcMain } from 'electron'
import { DirectoryManager, directoryManager } from '../indexables/directoryManager'
import { handleError } from '../common/handleError'
import { IndexingManager } from '../indexables/indexingManager'

export function setupIndexApi() {
  ipcMain.handle('index/indexAll', () => IndexingManager.indexAll())
  ipcMain.handle('index/selectDirectory', () => directoryManager.selectDirectory())
  ipcMain.handle('index/getDirectories', () =>
    handleError(() => directoryManager.getIndexedDirectories())
  )
  ipcMain.handle(
    'index/updateDirectories',
    (e, ...params: Parameters<InstanceType<typeof DirectoryManager>['updateDirectories']>) =>
      handleError(() => directoryManager.updateDirectories(...params))
  )
}
