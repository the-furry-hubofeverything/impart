import { dialog } from 'electron'
import { impartApp } from '..'
import { Directory } from '../database/entities/Directory'
import { indexingManager } from './indexingManager'
import { Taggable } from '../database/entities/Taggable'
import { tagManager } from '../tagging/tagManager'
import { In } from 'typeorm'
import { Tag } from '../database/entities/Tag'

interface DirectoryPayload {
  path: string
  autoTags?: number[]
}

export class DirectoryManager {
  public async getIndexedDirectories() {
    const query = Directory.createQueryBuilder('directories')

    const result = await query
      .loadRelationCountAndMap('directories.taggableCount', 'directories.taggables', 'taggables')
      .loadRelationIdAndMap('directories.autoTags', 'directories.autoTags')
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
    const directories = await Directory.find({ relations: { autoTags: true } })

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
    const currentTagIds = directory.autoTags.map((t) => t.id)
    let changed = false

    if (currentTagIds.sort().join(',') !== payload.autoTags?.sort().join(',')) {
      const nextTags =
        payload.autoTags == null || payload.autoTags.length == 0
          ? []
          : await Tag.findBy({ id: In(payload.autoTags) })

      const addedTags = nextTags?.filter((t) => !currentTagIds.includes(t.id)) ?? []

      if (addedTags.length > 0) {
        const directoryTaggables = await Taggable.findBy({ directory })

        if (directoryTaggables.length > 0) {
          tagManager.bulkTagTaggables(directoryTaggables, addedTags)
        }
      }

      directory.autoTags = nextTags
      changed = true
    }

    if (changed) {
      await directory.save()
    }
  }
}

export const directoryManager = new DirectoryManager()
