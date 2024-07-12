import { impartApp } from '..'
import { TaggableImage } from '../database/entities/TaggableImage'

class FileMessenger {
  public indexingStarted(filesFound: number) {
    impartApp.mainWindow?.webContents.send('file/indexingStarted', {
      filesFound
    })
  }

  public fileIndexed(file: TaggableImage) {
    impartApp.mainWindow?.webContents.send('file/fileIndexed', file)
  }

  public indexingEnded() {
    impartApp.mainWindow?.webContents.send('file/indexingEnded')
  }
}

export const fileMessenger = new FileMessenger()
