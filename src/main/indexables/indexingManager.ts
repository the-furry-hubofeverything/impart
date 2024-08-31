import { app, dialog, nativeImage, shell } from 'electron'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'
import { IsNull, Like } from 'typeorm'
import { fileMessenger } from './indexMessenger'
import { Directory } from '../database/entities/Directory'
import { impartApp } from '..'
import { sleep } from '../common/sleep'

async function delay(call: () => Promise<any>, delay: number) {
  await sleep(delay)
  return call()
}

class IndexingManager {
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

    fileMessenger.indexingStepStarted(files.length, 'indexing')

    await Promise.all(
      files.map((fileName, index) => delay(() => this.index(directory.path, fileName), index * 50))
    )

    const unsourcedImages = await TaggableImage.findBy({ source: IsNull() })
    fileMessenger.indexingStepStarted(unsourcedImages.length, 'sourceAssociation')
    await Promise.all(
      unsourcedImages.map((i, index) => delay(() => this.findAndAssociateSourceFile(i), index * 10))
    )

    fileMessenger.indexingEnded()
  }

  private async index(directory: string, fileName: string) {
    const fullPath = `${directory}/${fileName}`

    const extension = path.extname(fullPath).toLocaleLowerCase()

    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      await this.indexImage(fullPath)
    } else {
      await this.indexFile(fullPath)
    }

    fileMessenger.madeStepProgress()
  }

  private async indexImage(filePath: string) {
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

    await indexedImage.save()
    fileMessenger.fileIndexed(indexedImage)

    return indexedImage
  }

  private async indexFile(filePath: string) {
    console.log('Indexing File: ', filePath)

    let indexedFile = await TaggableFile.findOneBy({ fileIndex: { path: filePath } })

    if (indexedFile) {
      return indexedFile
    }

    indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) }
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
