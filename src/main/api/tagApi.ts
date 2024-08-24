import { ipcMain } from 'electron'
import { tagManager } from '../tagging/tagManager'
import { TagGroup } from '../database/entities/TagGroup'

export function setupTagApi() {
  ipcMain.handle('tag/getGroups', () => tagManager.getTagGroups())

  ipcMain.handle('tag/editFileTags', (e, fileId: number, tagIds: number[]) =>
    tagManager.setFileTags(fileId, tagIds)
  )

  ipcMain.handle('tag/createGroup', () => tagManager.createGroup())
  ipcMain.handle('tag/editGroup', (e, id: number, label?: string, defaultTagColor?: string) =>
    tagManager.editGroup(id, label, defaultTagColor)
  )

  ipcMain.handle('tag/createTag', (e, groupId: number) => tagManager.createTag(groupId))
}
