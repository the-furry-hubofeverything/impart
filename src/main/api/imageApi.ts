import { ipcMain } from 'electron'
import { imageManager } from '../imageManager'

export function setupImageApi() {
  ipcMain.handle('image/getThumbnail', (_e, imageId: number) => imageManager.getImage(imageId))
}
