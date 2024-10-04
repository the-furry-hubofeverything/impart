import { impartApp } from '..'

class ThumbnailMessenger {
  public buildingThumbnail() {
    impartApp.mainWindow?.webContents.send('thumbnail/buildingThumbnail')
  }

  public thumbnailBuilt() {
    impartApp.mainWindow?.webContents.send('thumbnail/thumbnailBuilt')
  }
}

export const thumbnailMessenger = new ThumbnailMessenger()
