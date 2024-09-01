import { dialog } from 'electron'
import { impartApp } from '..'
import { Directory } from '../database/entities/Directory'
import { indexingManager } from './indexingManager'

class DirectoryManager {
  public async getIndexedDirectories() {
    const query = Directory.createQueryBuilder('directories')

    const result = await query
      .loadRelationCountAndMap('directories.taggableCount', 'directories.taggables', 'taggables')
      .getMany()

    return result
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

    const directory = Directory.create({ path: result[0] })
    await directory.save()

    indexingManager.indexFiles(directory)
  }

  public async deleteDirectory(path: string) {
    const directory = await Directory.findOneByOrFail({ path })
    await directory.remove()
  }
}

export const directoryManager = new DirectoryManager()
