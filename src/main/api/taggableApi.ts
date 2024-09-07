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
}
