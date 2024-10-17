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
import { ImpartTask, TaskType } from '../task/impartTask'

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
    const unindexedFiles = files.filter(
      (f) => !indexedTaggables.some((t) => t.fileIndex.fileName === f)
    )

    if (unindexedFiles.length !== 0) {
      taskQueue.add(new IndexFilesTask(directory, unindexedFiles))
      taskQueue.add(new SourceAssociationTask(directory))

      if ((directory.autoTags?.length ?? 0) > 0) {
        TagManager.bulkTagDirectory(directory, unindexedFiles)
      }
    }

    const danglingFiles = indexedTaggables.filter((t) => !files.includes(t.fileIndex.fileName))

    if (danglingFiles.length !== 0) {
      taskQueue.add(new RemoveIndexedFilesTask(danglingFiles))
    }
  }

  async function getAllIndexedFilesInDirectory(directory: Directory) {
    const [images, files] = await Promise.all([
      TaggableImage.findBy({ directory }),
      TaggableFile.findBy({ directory })
    ])

    return [...images, ...files]
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
      shell.showItemInFolder(target.fileIndex.path)
    }
  }

  class IndexFilesTask extends ImpartTask<string> {
    protected TYPE: TaskType = 'indexing'
    protected DELAY: number = 18

    private directory: Directory

    public constructor(directory: Directory, unindexedFiles: string[]) {
      super()
      this.directory = directory
      this.targets = unindexedFiles
    }

    public async prepare(): Promise<void> {}

    protected performStep(item: string): Promise<void> {
      return index(this.directory, item)
    }
  }

  class SourceAssociationTask extends ImpartTask<TaggableImage> {
    protected TYPE: TaskType = 'sourceAssociation'
    protected DELAY: number = 10

    private directory: Directory

    public constructor(directory: Directory) {
      super()
      this.directory = directory
    }

    public async prepare(): Promise<void> {
      this.targets = await TaggableImage.findBy({ source: IsNull(), directory: this.directory })
    }

    protected performStep(item: TaggableImage): Promise<void> {
      return findAndAssociateSourceFile(item, this.directory)
    }
  }

  class RemoveIndexedFilesTask extends ImpartTask<Taggable> {
    protected TYPE: TaskType = 'removing'
    protected DELAY: number = 5

    public constructor(taggables: Taggable[]) {
      super()
      this.targets = taggables
    }

    public async prepare(): Promise<void> {}

    protected async performStep(item: Taggable): Promise<void> {
      await item.remove()
    }
  }
}
