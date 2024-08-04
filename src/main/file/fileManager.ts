import { dialog, shell } from 'electron'
import { TaggableImage } from '../database/entities/TaggableImage'
import { IndexedDirectory } from '../database/entities/IndexedDirectory'
import { readdirSync } from 'fs'
import { imageManager } from '../imageManager'
import { sleep } from '../common/sleep'
import { fileMessenger } from './fileMessenger'
import { impartApp } from '..'
import { AppDataSource } from '../database/database'
import { Tag } from '../database/entities/Tag'
import { In } from 'typeorm'

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
      files.map((fileName, index) =>
        (async () => {
          await sleep(index * 50)
          const taggableImage = await imageManager.indexImage(`${directory.path}/${fileName}`)
          fileMessenger.fileIndexed(taggableImage)
        })()
      )
    )

    fileMessenger.indexingEnded()
  }

  public async getFiles(tagIds?: number[]) {
    let query = TaggableImage.createQueryBuilder('files')

    if (tagIds && tagIds.length > 0) {
      query = query.leftJoin('files.tags', 'tags')

      tagIds.forEach((t) => {
        query = query.andWhere('tags.id = :id', { id: t })
      })
    }
    // const tags = tagIds ? await Tag.findBy({ id: In(tagIds) }) : []

    // return await TaggableImage.findBy({ tags: tags.length > 0 ? In(tags) : undefined })

    return await query.getMany()
  }

  public async openFile(taggableImageId: number) {
    const target = await TaggableImage.findOneBy({ id: taggableImageId })

    if (!target) {
      throw new Error(`Could not find taggable image with Id ${taggableImageId}`)
    }

    await shell.openPath(target.path)
  }
}

export const fileManager = new FileManager()
