import { impartApp } from '..'
import { Taggable } from '../database/entities/Taggable'
import { TaggableFile } from '../database/entities/TaggableFile'
import { TaggableImage } from '../database/entities/TaggableImage'

class FileMessenger {
  public indexingStarted(filesFound: number) {
    impartApp.mainWindow?.webContents.send('file/indexingStarted', {
      filesFound
    })
  }

  public fileIndexed(file: Taggable) {
    impartApp.mainWindow?.webContents.send('file/fileIndexed', file)
  }

  public sourceFileAssociated(image: TaggableImage, file: TaggableFile) {
    impartApp.mainWindow?.webContents.send('file/sourceFileAssociated', { image, file })
  }

  public indexingEnded() {
    impartApp.mainWindow?.webContents.send('file/indexingEnded')
  }
}

export const fileMessenger = new FileMessenger()
