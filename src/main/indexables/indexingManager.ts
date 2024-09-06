import { shell } from 'electron'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'
import { IsNull, Like } from 'typeorm'
import { fileMessenger } from './indexMessenger'
import { Directory } from '../database/entities/Directory'
import { delay, sleep } from '../common/sleep'
import { imageSize } from 'image-size'

class IndexingManager {
  public async indexFiles(directory: Directory) {
    const dirents = await readdir(directory.path, { withFileTypes: true })
    const files = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name)

    fileMessenger.indexingStepStarted(files.length, 'indexing')

    await Promise.all(
      files.map((fileName, index) => delay(() => this.index(directory, fileName), index * 20))
    )

    const unsourcedImages = await TaggableImage.findBy({ source: IsNull() })
    fileMessenger.indexingStepStarted(unsourcedImages.length, 'sourceAssociation')
    await Promise.all(
      unsourcedImages.map((i, index) => delay(() => this.findAndAssociateSourceFile(i), index * 10))
    )

    fileMessenger.indexingEnded()
  }

  private async index(directory: Directory, fileName: string) {
    const fullPath = `${directory.path}/${fileName}`

    const extension = path.extname(fullPath).toLocaleLowerCase()

    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      await this.indexImage(fullPath, directory)
    } else {
      await this.indexFile(fullPath, directory)
    }

    fileMessenger.madeStepProgress()
  }

  private async indexImage(filePath: string, directory: Directory) {
    console.log('Indexing Image: ', filePath)
    let indexedImage = await TaggableImage.findOneBy({ fileIndex: { path: filePath } })

    if (indexedImage) {
      return indexedImage
    }

    indexedImage = TaggableImage.create({
      fileIndex: {
        path: filePath,
        fileName: path.basename(filePath)
      },
      directory,
      dimensions: imageSize(filePath),
      dateModified: (await stat(filePath)).mtime
    })

    await indexedImage.save()
    fileMessenger.fileIndexed(indexedImage)

    return indexedImage
  }

  private async indexFile(filePath: string, directory: Directory) {
    console.log('Indexing File: ', filePath)

    let indexedFile = await TaggableFile.findOneBy({ fileIndex: { path: filePath } })

    if (indexedFile) {
      return indexedFile
    }

    indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) },
      directory,
      dateModified: (await stat(filePath)).mtime
    })

    await indexedFile.save()
    fileMessenger.fileIndexed(indexedFile)

    return indexedFile
  }

  private async findAndAssociateSourceFile(image: TaggableImage) {
    const possibleSourceFile = await TaggableFile.findOneBy({
      fileIndex: { fileName: Like(`${path.parse(image.fileIndex.path).name}.%`) }
    })

    if (possibleSourceFile) {
      console.log('Associating indexed image with: ', possibleSourceFile.fileIndex.path)
      image.source = possibleSourceFile
      fileMessenger.sourceFileAssociated(image, possibleSourceFile)

      await image.save()
    }

    fileMessenger.madeStepProgress()
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
