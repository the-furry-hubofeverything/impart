import { ipcMain } from 'electron'
import { TagManager, tagManager } from '../tagging/tagManager'

export function setupTagApi() {
  ipcMain.handle('tag/getGroups', () => tagManager.getTagGroups())

  ipcMain.handle('tag/editFileTags', (e, fileId: number, tagIds: number[]) =>
    tagManager.setFileTags(fileId, tagIds)
  )

  ipcMain.handle('tag/createGroup', () => tagManager.createGroup())
  ipcMain.handle(
    'tag/editGroup',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['editGroup']>) =>
      tagManager.editGroup(...params)
  )
  ipcMain.handle(
    'tag/deleteGroup',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['deleteGroup']>) =>
      tagManager.deleteGroup(...params)
  )

  ipcMain.handle('tag/createTag', (e, groupId: number) => tagManager.createTag(groupId))
  ipcMain.handle(
    'tag/editTag',
    (e, ...params: Parameters<InstanceType<typeof TagManager>['editTag']>) =>
      tagManager.editTag(...params)
  )
}
