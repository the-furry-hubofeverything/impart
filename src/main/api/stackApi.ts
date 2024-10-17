import { ipcMain } from 'electron'
import { handleError } from '../common/handleError'
import { StackManager } from '../tagging/stackManager'

export function setupStackApi() {
  ipcMain.handle('stack/create', (e, ...params: Parameters<typeof StackManager.create>) =>
    handleError(() => StackManager.create(...params))
  )

  ipcMain.handle('stack/addToStack', (e, ...params: Parameters<typeof StackManager.addToStack>) =>
    handleError(() => StackManager.addToStack(...params))
  )

  ipcMain.handle(
    'stack/moveToHome',
    (e, ...params: Parameters<typeof StackManager.moveTaggablesToHome>) =>
      handleError(() => StackManager.moveTaggablesToHome(...params))
  )

  ipcMain.handle('stack/remove', (e, ...params: Parameters<typeof StackManager.removeStack>) =>
    handleError(() => StackManager.removeStack(...params))
  )
}
