import { dialog } from 'electron'
import { TaggableImage } from '../database/entities/TaggableImage'
import { IndexedDirectory } from '../database/entities/IndexedDirectory'
import { readdirSync } from 'fs'
import { imageManager } from '../imageManager'
import { sleep } from '../common/sleep'
import { fileMessenger } from './fileMessenger'
import { impartApp } from '..'
import { AppDataSource } from '../database/database'

class FileManager {
  public async getIndexedDirectories() {
    const directories = await IndexedDirectory.find()

    return directories.map((d) => ({
      path: d.path
    }))
  }

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
    await directory.save()

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
    return await TaggableImage.find()
  }
}

export const fileManager = new FileManager()
