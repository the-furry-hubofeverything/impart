import { dialog } from 'electron'
import { impartApp } from '..'
import { Directory } from '../database/entities/Directory'
import { indexingManager } from './indexingManager'

interface DirectoryPayload {
  path: string
}

export class DirectoryManager {
  public async getIndexedDirectories() {
    const query = Directory.createQueryBuilder('directories')

    const result = await query
      .loadRelationCountAndMap('directories.taggableCount', 'directories.taggables', 'taggables')
      .getMany()

    return result
  }

  public async selectDirectory() {
    if (!impartApp.mainWindow) {
      throw new Error('Tried to open a file dialog without access to the window')
    }

    const result = await dialog.showOpenDialog(impartApp.mainWindow, {
      properties: ['openDirectory']
    })

    return result.canceled ? undefined : result.filePaths[0]
  }

  public async updateDirectories(directoryPayloads: DirectoryPayload[]) {
    const directories = await Directory.find()

    const unaddedDirectories = directoryPayloads.filter(
      (p) => !directories.some((d) => d.path === p.path)
    )
    const updatedDirectories = directories
      .map((d) => ({ directory: d, payload: directoryPayloads.find((p) => p.path === d.path) }))
      .filter((d) => d.payload == null)
    const removedDirectories = directories.filter(
      (d) => !directoryPayloads.some((p) => p.path === d.path)
    )

    for (const d of unaddedDirectories) {
      await this.createDirectory(d)
    }

    for (const d of updatedDirectories) {
      await this.updateDirectory(d.directory, d.payload!)
    }

    for (const d of removedDirectories) {
      await d.remove()
    }
  }

  private async createDirectory(payload: DirectoryPayload) {
    const directory = Directory.create({ path: payload.path })
    await directory.save()
    await indexingManager.indexFiles(directory)
  }

  private async updateDirectory(directory: Directory, payload: DirectoryPayload) {
    //Placeholder (nothing to update yet)
  }
}

export const directoryManager = new DirectoryManager()
