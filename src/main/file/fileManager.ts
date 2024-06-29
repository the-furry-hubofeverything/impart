import { dialog } from 'electron'
import { TaggableImage } from '../database/entities/TaggableImage'
import { IndexedDirectory } from '../database/entities/IndexedDirectory'
import { readdirSync } from 'fs'
import { imageManager } from '../imageManager'
import { sleep } from '../common/sleep'
import { fileMessenger } from './fileMessenger'
import { impartApp } from '..'

class FileManager {
  public async selectAndIndexDirectory() {
    if (!impartApp.mainWindow) {
      throw new Error('Tried to open a file dialog without access to the window')
    }

    const result = dialog.showOpenDialogSync(impartApp.mainWindow, {
      properties: ['openDirectory']
    })

    if (!result) {
      return
    }

    const directory = IndexedDirectory.create({ path: result[0] })
    directory.save()

    this.indexFiles(directory)
  }

  private async indexFiles(directory: IndexedDirectory) {
    const files = readdirSync(directory.path)

    for (const [index, fileName] of files.entries()) {
      imageManager.indexImage(`${directory.path}/${fileName}`)
      fileMessenger.fileIndexed(index + 1, files.length)
      await sleep(20)
    }
  }

  public async getFiles() {
    const files = await TaggableImage.find()

    return files.map((f) => f.path)
  }
}

export const fileManager = new FileManager()
