import { impartApp } from '..'
import { Taggable } from '../database/entities/Taggable'

class FileMessenger {
  public indexingStarted(filesFound: number) {
    impartApp.mainWindow?.webContents.send('file/indexingStarted', {
      filesFound
    })
  }

  public fileIndexed(file: Taggable) {
    impartApp.mainWindow?.webContents.send('file/fileIndexed', file)
  }

  public indexingEnded() {
    impartApp.mainWindow?.webContents.send('file/indexingEnded')
  }
}

export const fileMessenger = new FileMessenger()
