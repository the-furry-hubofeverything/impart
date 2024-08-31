import { impartApp } from '..'
import { Taggable } from '../database/entities/Taggable'
import { TaggableFile } from '../database/entities/TaggableFile'
import { TaggableImage } from '../database/entities/TaggableImage'

type IndexingStep = 'indexing' | 'sourceAssociation'

class FileMessenger {
  public indexingStepStarted(filesFound: number, step: IndexingStep) {
    impartApp.mainWindow?.webContents.send('file/indexingStarted', {
      filesFound,
      step
    })
  }

  public fileIndexed(file: Taggable) {
    impartApp.mainWindow?.webContents.send('file/fileIndexed', file)
  }

  public sourceFileAssociated(image: TaggableImage, file: TaggableFile) {
    impartApp.mainWindow?.webContents.send('file/sourceFileAssociated', { image, file })
  }

  public madeStepProgress() {
    impartApp.mainWindow?.webContents.send('file/madeStepProgress')
  }

  public indexingEnded() {
    impartApp.mainWindow?.webContents.send('file/indexingEnded')
  }
}

export const fileMessenger = new FileMessenger()
