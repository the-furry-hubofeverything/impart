import { ipcMain } from 'electron'
import { TaggableManager, taggableManager } from '../tagging/taggableManager'
import { handleError } from '../common/handleError'

export function setupTaggableApi() {
  ipcMain.handle(
    'taggable/getTaggables',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['getTaggables']>) =>
      handleError(() => taggableManager.getTaggables(...params))
  )

  ipcMain.handle(
    'taggable/getAllTaggableYears',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['getAllTaggableYears']>) =>
      handleError(() => taggableManager.getAllTaggableYears(...params))
  )

  ipcMain.handle(
    'taggable/createStack',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['createStack']>) =>
      handleError(() => taggableManager.createStack(...params))
  )

  ipcMain.handle(
    'taggable/setHidden',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['setHidden']>) =>
      handleError(() => taggableManager.setHidden(...params))
  )
}
