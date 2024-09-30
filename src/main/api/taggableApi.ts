import { ipcMain } from 'electron'
import { TaggableManager, taggableManager } from '../tagging/taggableManager'

export function setupTaggableApi() {
  ipcMain.handle(
    'taggable/getTaggables',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['getTaggables']>) =>
      taggableManager.getTaggables(...params)
  )

  ipcMain.handle(
    'taggable/getAllTaggableYears',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['getAllTaggableYears']>) =>
      taggableManager.getAllTaggableYears(...params)
  )

  ipcMain.handle(
    'taggable/createStack',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['createStack']>) =>
      taggableManager.createStack(...params)
  )

  ipcMain.handle(
    'taggable/setHidden',
    (e, ...params: Parameters<InstanceType<typeof TaggableManager>['setHidden']>) =>
      taggableManager.setHidden(...params)
  )
}
