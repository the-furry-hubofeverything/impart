import { dialog } from 'electron'
import { impartApp } from '..'
import { Directory } from '../database/entities/Directory'
import { Taggable } from '../database/entities/Taggable'
import { In } from 'typeorm'
import { Tag } from '../database/entities/Tag'
import { TagManager } from '../tagging/tagManager'
import { IndexingManager } from './indexingManager'

interface DirectoryPayload {
  path: string
  autoTags?: number[]
}

export namespace DirectoryManager {
  export async function getIndexedDirectories() {
    const query = Directory.createQueryBuilder('directories')

    const result = await query
      .loadRelationCountAndMap('directories.taggableCount', 'directories.taggables', 'taggables')
      .loadRelationIdAndMap('directories.autoTags', 'directories.autoTags')
      .orderBy('directories.path')
      .getMany()

    return result
  }

  export async function selectDirectory() {
    if (!impartApp.mainWindow) {
      throw new Error('Tried to open a file dialog without access to the window')
    }

    const result = await dialog.showOpenDialog(impartApp.mainWindow, {
      properties: ['openDirectory']
    })

    return result.canceled ? undefined : result.filePaths[0]
  }

  export async function updateDirectories(directoryPayloads: DirectoryPayload[]) {
    const directories = await Directory.find({ relations: { autoTags: true } })

    const unaddedDirectories = directoryPayloads.filter(
      (p) => !directories.some((d) => d.path === p.path)
    )
    const updatedDirectories = directories
      .map((d) => ({ directory: d, payload: directoryPayloads.find((p) => p.path === d.path) }))
      .filter((d) => d.payload != null)
    const removedDirectories = directories.filter(
      (d) => !directoryPayloads.some((p) => p.path === d.path)
    )

    for (const d of unaddedDirectories) {
      await createDirectory(d)
    }

    for (const d of updatedDirectories) {
      await updateDirectory(d.directory, d.payload!)
    }

    for (const d of removedDirectories) {
      await d.remove()
    }
  }

  async function createDirectory(payload: DirectoryPayload) {
    const tags =
      (payload.autoTags?.length ?? 0) > 0 ? await Tag.findBy({ id: In(payload.autoTags!) }) : []

    const directory = Directory.create({
      path: payload.path,
      autoTags: tags
    })

    await directory.save()
    await IndexingManager.indexFiles(directory)
  }

  async function updateDirectory(directory: Directory, payload: DirectoryPayload) {
    if (!directory.autoTags) {
      throw new Error('Auto tags were not loaded')
    }

    const currentTagIds = directory.autoTags.map((t) => t.id)
    const tagsChanged = currentTagIds.sort().join(',') !== payload.autoTags?.sort().join(',')

    if (tagsChanged) {
      const nextTags =
        payload.autoTags == null || payload.autoTags.length == 0
          ? []
          : await Tag.findBy({ id: In(payload.autoTags) })

      directory.autoTags = nextTags

      await directory.save()
      TagManager.bulkTagDirectory(directory)
    }
  }
}
