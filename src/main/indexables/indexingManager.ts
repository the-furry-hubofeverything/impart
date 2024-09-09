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
  private isIndexing = false

  public async indexAll() {
    if (this.isIndexing) {
      console.log('Indexing skipped: Indexing is already in progress')
      return
    }

    try {
      this.isIndexing = true
      const directories = await Directory.find()

      for (const directory of directories) {
        console.log('Indexing:', directory.path)
        await this.indexFiles(directory)
      }
    } finally {
      this.isIndexing = false
    }
  }

  public async indexFiles(directory: Directory) {
    const dirents = await readdir(directory.path, { withFileTypes: true })
    const files = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name)

    const indexedTaggables = await this.getAllIndexedFilesInDirectory(directory)
    const unindexedFiles = files.filter((f) => !indexedTaggables.includes(f))

    if (unindexedFiles.length === 0) {
      return
    }

    fileMessenger.indexingStepStarted(unindexedFiles.length, 'indexing')

    await Promise.all(
      unindexedFiles.map((fileName, index) =>
        delay(() => this.index(directory, fileName), index * 18)
      )
    )

    const unsourcedImages = await TaggableImage.findBy({ source: IsNull(), directory })
    fileMessenger.indexingStepStarted(unsourcedImages.length, 'sourceAssociation')
    await Promise.all(
      unsourcedImages.map((i, index) =>
        delay(() => this.findAndAssociateSourceFile(i, directory), index * 10)
      )
    )

    fileMessenger.indexingEnded()
  }

  private async getAllIndexedFilesInDirectory(directory: Directory) {
    const [images, files] = await Promise.all([
      TaggableImage.createQueryBuilder()
        .select('fileIndexFilename')
        .where('directoryPath = :dir AND fileIndexFilename IS NOT NULL', { dir: directory.path })
        .getRawMany<{ fileIndexFilename: string }>(),
      TaggableFile.createQueryBuilder()
        .select('fileIndexFilename')
        .where('directoryPath = :dir AND fileIndexFilename IS NOT NULL', { dir: directory.path })
        .getRawMany<{ fileIndexFilename: string }>()
    ])

    return images.map((i) => i.fileIndexFilename).concat(files.map((f) => f.fileIndexFilename))
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
    const indexedImage = TaggableImage.create({
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
  }

  private async indexFile(filePath: string, directory: Directory) {
    console.log('Indexing File: ', filePath)

    const indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) },
      directory,
      dateModified: (await stat(filePath)).mtime
    })

    await indexedFile.save()
    fileMessenger.fileIndexed(indexedFile)
  }

  private async findAndAssociateSourceFile(image: TaggableImage, directory: Directory) {
    const possibleSourceFile = await TaggableFile.findOneBy({
      fileIndex: { fileName: Like(`${path.parse(image.fileIndex.path).name}.%`) },
      directory
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
