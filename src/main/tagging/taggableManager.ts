import { dialog } from 'electron'
import { Directory } from '../database/entities/Directory'
import { readdirSync } from 'fs'
import path from 'path'
import { indexingManager } from '../indexables/indexingManager'
import { sleep } from '../common/sleep'
import { fileMessenger } from '../indexables/indexMessenger'
import { impartApp } from '..'
import { Taggable } from '../database/entities/Taggable'

class TaggableManager {
  public async getIndexedDirectories() {
    const directories = await Directory.find()

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

    const directory = Directory.create({ path: result[0] })
    await directory.save()

    this.indexFiles(directory)
  }

  private async indexFiles(directory: Directory) {
    const files = readdirSync(directory.path)

    fileMessenger.indexingStarted(files.length)

    await Promise.all(
      files.map((fileName, index) => this.index(directory.path, fileName, index * 50))
    )

    fileMessenger.indexingEnded()
  }

  private async index(directory: string, fileName: string, delay: number) {
    await sleep(delay)
    const fullPath = `${directory}/${fileName}`

    const extension = path.extname(fullPath).toLocaleLowerCase()

    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      await indexingManager.indexImage(fullPath)
    } else {
      await indexingManager.indexFile(fullPath)
    }
  }

  public async getTaggables(tagIds?: number[]) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (tagIds && tagIds.length > 0) {
      Array.from(tagIds).forEach((t, index) => {
        const alias = `tags${index}`
        const variable = `id${index}`
        query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
          [variable]: t
        })
      })
    }

    query
      .leftJoin('files.images', 'associatedImages')
      .where('associatedImages.id IS NULL')
      .orderBy('files.fileIndex.fileName')

    return await query.getMany()
  }
}

export const taggableManager = new TaggableManager()
