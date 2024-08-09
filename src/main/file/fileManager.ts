import { dialog, shell } from 'electron'
import { IndexedDirectory } from '../database/entities/IndexedDirectory'
import { readdirSync } from 'fs'
import path from 'path'
import { imageManager } from '../imageManager'
import { sleep } from '../common/sleep'
import { fileMessenger } from './fileMessenger'
import { impartApp } from '..'
import { Taggable } from '../database/entities/Taggable'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { isTaggableImage } from '../database/entities/TaggableImage'

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

    fileMessenger.indexingStarted(files.length)

    await Promise.all(
      files.map((fileName, index) => this.index(directory.path, fileName, index * 50))
    )

    fileMessenger.indexingEnded()
  }

  private async index(directory: string, fileName: string, delay: number) {
    await sleep(delay)
    const fullPath = `${directory}/${fileName}`

    const extension = path.extname(fullPath)
    let taggable: Taggable

    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      taggable = await imageManager.indexImage(fullPath)
    } else {
      taggable = await this.indexFile(fullPath)
    }

    fileMessenger.fileIndexed(taggable)
  }

  private async indexFile(filePath: string) {
    console.log('Indexing File: ', filePath)

    let taggableFile = await TaggableFile.findOneBy({ path: filePath })

    if (!taggableFile) {
      taggableFile = TaggableFile.create({
        path: filePath,
        fileName: path.basename(filePath)
      })

      await taggableFile.save()
    }

    return taggableFile
  }

  public async getFiles(tagIds?: number[]) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (tagIds && tagIds.length > 0) {
      Array.from(tagIds).forEach((t, index) => {
        const alias = `tags${index}`
        const variable = `id${index}`
        query = query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
          [variable]: t
        })
      })
    }

    return await query.getMany()
  }

  public async openFile(taggableId: number) {
    const target = await Taggable.findOneBy({ id: taggableId })

    if (!target) {
      throw new Error(`Could not find taggable with Id ${taggableId}`)
    }

    if (isTaggableFile(target)) {
      await shell.openPath(target.path)
    } else if (isTaggableImage(target)) {
      await shell.openPath(target.image.path)
    }
  }
}

export const fileManager = new FileManager()
