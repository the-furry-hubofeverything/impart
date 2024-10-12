import { ipcMain } from 'electron'
import { TaggableManager, taggableManager } from '../tagging/taggableManager'
import { handleError } from '../common/handleError'
import { StackManager, stackManager } from '../tagging/stackManager'

export function setupStackApi() {
  ipcMain.handle(
    'stack/create',
    (e, ...params: Parameters<InstanceType<typeof StackManager>['create']>) =>
      handleError(() => stackManager.create(...params))
  )

  ipcMain.handle(
    'stack/addToStack',
    (e, ...params: Parameters<InstanceType<typeof StackManager>['addToStack']>) =>
      handleError(() => stackManager.addToStack(...params))
  )

  ipcMain.handle(
    'stack/moveToHome',
    (e, ...params: Parameters<InstanceType<typeof StackManager>['moveTaggablesToHome']>) =>
      handleError(() => stackManager.moveTaggablesToHome(...params))
  )
}
