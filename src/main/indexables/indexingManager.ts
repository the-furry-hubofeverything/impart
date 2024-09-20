import { shell } from 'electron'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'
import { IsNull, Like } from 'typeorm'
import { Directory } from '../database/entities/Directory'
import { imageSize } from 'image-size'
import { taskQueue } from '../task/taskQueue'

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

    taskQueue.add({
      steps: unindexedFiles.map((fileName) => () => this.index(directory, fileName)),
      delayPerItem: 18,
      type: 'indexing'
    })

    taskQueue.add({
      steps: async () => {
        const unsourcedImages = await TaggableImage.findBy({ source: IsNull(), directory })
        return unsourcedImages.map((i) => () => this.findAndAssociateSourceFile(i, directory))
      },
      delayPerItem: 10,
      type: 'indexing'
    })
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
  }

  private async indexImage(filePath: string, directory: Directory) {
    console.log('Indexing Image: ', filePath)
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
  }

  private async indexFile(filePath: string, directory: Directory) {
    console.log('Indexing File: ', filePath)

    const indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) },
      directory,
      dateModified: (await stat(filePath)).mtime
    })

    await indexedFile.save()
  }

  private async findAndAssociateSourceFile(image: TaggableImage, directory: Directory) {
    const possibleSourceFile = await TaggableFile.findOneBy({
      fileIndex: { fileName: Like(`${path.parse(image.fileIndex.path).name}.%`) },
      directory
    })

    if (possibleSourceFile) {
      console.log('Associating indexed image with: ', possibleSourceFile.fileIndex.path)
      image.source = possibleSourceFile

      await image.save()
    }
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
