import { app, nativeImage, shell } from 'electron'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'

class IndexingManager {
  private targetPath: string | undefined

  public setPath(path: string) {
    this.targetPath = path
  }

  public getPath() {
    return this.targetPath
  }

  public async indexImage(filePath: string) {
    console.log('Indexing Image: ', filePath)
    let indexedImage = await TaggableImage.findOneBy({ fileIndex: { path: filePath } })

    if (!indexedImage) {
      indexedImage = await this.buildImage(filePath)
    }

    return indexedImage
  }

  private async buildImage(filePath: string) {
    const image = nativeImage.createFromPath(filePath)

    const indexedImage = TaggableImage.create({
      fileIndex: {
        path: filePath,
        fileName: path.basename(filePath)
      },
      dimensions: image.getSize()
    })

    await indexedImage.save()

    return indexedImage
  }

  public async indexFile(filePath: string) {
    console.log('Indexing File: ', filePath)

    let indexedFile = await TaggableFile.findOneBy({ fileIndex: { path: filePath } })

    if (!indexedFile) {
      indexedFile = TaggableFile.create({
        fileIndex: { path: filePath, fileName: path.basename(filePath) }
      })

      await indexedFile.save()
    }

    return indexedFile
  }

  public async openFile(taggableId: number) {
    const target = await Taggable.findOneBy({ id: taggableId })

    if (!target) {
      throw new Error(`Could not find taggable with Id ${taggableId}`)
    }

    if (isTaggableFile(target) || isTaggableImage(target)) {
      await shell.openPath(target.fileIndex.path)
    }
  }
}

export const indexingManager = new IndexingManager()
