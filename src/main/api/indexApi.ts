import { ipcMain } from 'electron'
import { indexingManager } from '../indexables/indexingManager'
import { directoryManager } from '../indexables/directoryManager'

export function setupIndexApi() {
  ipcMain.handle('index/selectAndIndexDirectory', () => directoryManager.selectAndIndexDirectory())
  ipcMain.handle('index/getDirectories', () => directoryManager.getIndexedDirectories())
  ipcMain.handle('index/deleteDirectory', (e, path: string) =>
    directoryManager.deleteDirectory(path)
  )
}
