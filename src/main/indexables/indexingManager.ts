import { app, nativeImage, shell } from 'electron'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'
import { Like } from 'typeorm'
import { fileMessenger } from './indexMessenger'

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

    if (indexedImage) {
      return indexedImage
    }

    const image = nativeImage.createFromPath(filePath)

    indexedImage = TaggableImage.create({
      fileIndex: {
        path: filePath,
        fileName: path.basename(filePath)
      },
      dimensions: image.getSize()
    })

    const possibleSourceFile = await TaggableFile.findOneBy({
      fileIndex: { fileName: Like(`${path.parse(filePath).name}%`) }
    })

    if (possibleSourceFile) {
      console.log('Associating indexed image with: ', possibleSourceFile.fileIndex.path)
      indexedImage.source = possibleSourceFile
      fileMessenger.sourceFileAssociated(indexedImage, possibleSourceFile)
    }

    await indexedImage.save()
    fileMessenger.fileIndexed(indexedImage)

    return indexedImage
  }

  public async indexFile(filePath: string) {
    console.log('Indexing File: ', filePath)

    let indexedFile = await TaggableFile.findOneBy({ fileIndex: { path: filePath } })

    if (indexedFile) {
      return indexedFile
    }

    indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) }
    })

    await indexedFile.save()

    const associatedImage = await TaggableImage.findOneBy({
      fileIndex: { fileName: Like(`${path.parse(filePath).name}%`) }
    })

    if (associatedImage && associatedImage.source == null) {
      console.log('Associating indexed file with: ', associatedImage.fileIndex.path)
      associatedImage.source = indexedFile
      await associatedImage.save()
      fileMessenger.sourceFileAssociated(associatedImage, indexedFile)
    }

    fileMessenger.fileIndexed(indexedFile)

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
