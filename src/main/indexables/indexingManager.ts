import { shell } from 'electron'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'
import { In, IsNull, Like } from 'typeorm'
import { Directory } from '../database/entities/Directory'
import { imageSize } from 'image-size'
import { taskQueue } from '../task/taskQueue'
import dayjs from 'dayjs'
import { TagManager } from '../tagging/tagManager'

export namespace IndexingManager {
  let isIndexing = false

  export async function indexAll() {
    if (isIndexing) {
      console.log('Indexing skipped: Indexing is already in progress')
      return
    }

    try {
      isIndexing = true
      const directories = await Directory.find({ relations: { autoTags: true } })

      for (const directory of directories) {
        console.log('Indexing:', directory.path)
        await indexFiles(directory)
      }
    } finally {
      isIndexing = false
    }
  }

  export async function indexFiles(directory: Directory) {
    const dirents = await readdir(directory.path, { withFileTypes: true })
    const files = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name)

    const indexedTaggables = await getAllIndexedFilesInDirectory(directory)
    const unindexedFiles = files.filter((f) => !indexedTaggables.includes(f))

    if (unindexedFiles.length === 0) {
      return
    }

    taskQueue.add({
      steps: unindexedFiles.map((fileName) => () => index(directory, fileName)),
      delayPerItem: 18,
      type: 'indexing'
    })

    taskQueue.add({
      steps: async () => {
        const unsourcedImages = await TaggableImage.findBy({ source: IsNull(), directory })
        return unsourcedImages.map((i) => () => findAndAssociateSourceFile(i, directory))
      },
      delayPerItem: 10,
      type: 'sourceAssociation'
    })

    if (directory.autoTags.length > 0) {
      TagManager.bulkTagTaggables(async () => {
        const [addedImages, addedFiles] = await Promise.all([
          TaggableImage.findBy({ directory, fileIndex: { fileName: In(unindexedFiles) } }),
          TaggableFile.findBy({ directory, fileIndex: { fileName: In(unindexedFiles) } })
        ])

        return [...addedImages, ...addedFiles]
      }, directory.autoTags)
    }
  }

  async function getAllIndexedFilesInDirectory(directory: Directory) {
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

  async function index(directory: Directory, fileName: string) {
    const fullPath = `${directory.path}/${fileName}`

    const extension = path.extname(fullPath).toLocaleLowerCase()

    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      await indexImage(fullPath, directory)
    } else {
      await indexFile(fullPath, directory)
    }
  }

  async function indexImage(filePath: string, directory: Directory) {
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

  async function indexFile(filePath: string, directory: Directory) {
    console.log('Indexing File: ', filePath)

    const indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) },
      directory,
      dateModified: (await stat(filePath)).mtime
    })

    await indexedFile.save()
  }

  async function findAndAssociateSourceFile(image: TaggableImage, directory: Directory) {
    const possibleSourceFiles = await TaggableFile.findBy({
      fileIndex: { fileName: Like(`${path.parse(image.fileIndex.path).name}.%`) },
      directory
    })

    if (possibleSourceFiles.length > 0) {
      //If multiple files have the same filename (but with different extensions),
      // we grab whichever one has the closest modification date to the image
      if (possibleSourceFiles.length > 1) {
        possibleSourceFiles.sort(
          (a, b) =>
            Math.abs(dayjs(a.dateModified).diff(image.dateModified)) -
            Math.abs(dayjs(b.dateModified).diff(image.dateModified))
        )
      }

      console.log('Associating indexed image with: ', possibleSourceFiles[0].fileIndex.path)
      image.source = possibleSourceFiles[0]

      await image.save()
    }
  }

  export async function openFile(taggableId: number) {
    const target = await Taggable.findOneByOrFail({ id: taggableId })
    if (isTaggableFile(target) || isTaggableImage(target)) {
      await shell.openPath(target.fileIndex.path)
    }
  }

  export async function openFileLocation(taggableId: number) {
    const target = await Taggable.findOneByOrFail({ id: taggableId })

    if (isTaggableFile(target) || isTaggableImage(target)) {
      await shell.showItemInFolder(target.fileIndex.path)
    }
  }
}
