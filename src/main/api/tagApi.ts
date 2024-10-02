import { ipcMain } from 'electron'
import { TagManager, tagManager } from '../tagging/tagManager'
import { handleError } from '../common/handleError'

export function setupTagApi() {
  ipcMain.handle('tag/getGroups', () => handleError(() => tagManager.getTagGroups()))

  ipcMain.handle('tag/editFileTags', (e, fileId: number, tagIds: number[]) =>
    handleError(() => tagManager.setFileTags(fileId, tagIds))
  )
  ipcMain.handle(
    'tag/bulkTag',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['bulkTag']>) =>
      handleError(() => tagManager.bulkTag(...params))
  )

  ipcMain.handle('tag/createGroup', () => handleError(() => tagManager.createGroup()))
  ipcMain.handle(
    'tag/editGroup',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['editGroup']>) =>
      handleError(() => tagManager.editGroup(...params))
  )
  ipcMain.handle(
    'tag/deleteGroup',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['deleteGroup']>) =>
      handleError(() => tagManager.deleteGroup(...params))
  )

  ipcMain.handle('tag/createTag', (e, groupId: number) =>
    handleError(() => tagManager.createTag(groupId))
  )
  ipcMain.handle(
    'tag/editTag',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['editTag']>) =>
      handleError(() => tagManager.editTag(...params))
  )
  ipcMain.handle(
    'tag/deleteTag',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['deleteTag']>) =>
      handleError(() => tagManager.deleteTag(...params))
  )
}
