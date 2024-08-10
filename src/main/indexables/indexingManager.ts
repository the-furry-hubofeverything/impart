import { app, shell } from 'electron'
import { existsSync, mkdirSync } from 'fs'
import sharp from 'sharp'
import { Thumbnail } from '../database/entities/Thumbnail'
import path from 'path'
import { IndexedImage } from '../database/entities/IndexedImage'
import { IndexedFile } from '../database/entities/IndexedFile'
import { Indexable } from '../database/entities/Indexable'

class IndexingManager {
  private targetPath: string | undefined

  public setPath(path: string) {
    this.targetPath = path
  }

  public getPath() {
    return this.targetPath
  }

  public async getThumbnail(indexedImageId: number) {
    const indexedImage = await IndexedImage.findOne({
      where: { id: indexedImageId },
      relations: { thumbnail: true }
    })

    if (!indexedImage) {
      throw new Error(`Could not find IndexedImage with ID ${indexedImageId}`)
    }

    let thumbnail = indexedImage.thumbnail

    if (!thumbnail) {
      thumbnail = await this.buildThumbnail(indexedImage.path)

      indexedImage.thumbnail = thumbnail
      indexedImage.save()
    }

    return await this.getBase64(indexedImage)
  }

  public async indexImage(filePath: string) {
    console.log('Indexing Image: ', filePath)
    let indexedImage = await IndexedImage.findOneBy({ path: filePath })

    if (!indexedImage) {
      indexedImage = await this.buildImage(filePath)
    }

    return indexedImage
  }

  private async buildImage(filePath: string) {
    const image = await sharp(filePath).metadata()

    const [thumbnail, pinkynail] = await Promise.all([
      this.buildThumbnail(filePath),
      this.buildPinkynail(filePath)
    ])

    const indexedImage = IndexedImage.create({
      path: filePath,
      fileName: path.basename(filePath),
      dimensions: {
        width: image.width,
        height: image.height
      },
      thumbnail,
      pinkynail
    })

    await indexedImage.save()

    return indexedImage
  }

  private async buildThumbnail(filePath: string) {
    const thumbnailPath = app.isPackaged
      ? `${app.getPath('appData')}/impart/app/thumbnails`
      : `${app.getPath('appData')}/impart/dev/thumbnails`

    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath)
    }

    const image = sharp(filePath).resize({
      height: 400
    })

    const target = `${thumbnailPath}/${path.basename(filePath)}`
    image.toFile(target)

    const buffer = await image.toBuffer({ resolveWithObject: true })

    const thumbnail = Thumbnail.create({
      path: target,
      fileName: path.basename(target),
      dimensions: {
        width: buffer.info.width,
        height: buffer.info.height
      }
    })

    await thumbnail.save()
    return thumbnail
  }

  private async buildPinkynail(filePath: string) {
    const buffer = await sharp(filePath)
      .resize({
        height: 16
      })
      .toBuffer()

    return buffer.toString('base64')
  }

  private async getBase64(image: IndexedImage) {
    return (await sharp(image.path).toBuffer()).toString('base64')
  }

  public async indexFile(filePath: string) {
    console.log('Indexing File: ', filePath)

    let indexedFile = await IndexedFile.findOneBy({ path: filePath })

    if (!indexedFile) {
      indexedFile = IndexedFile.create({
        path: filePath,
        fileName: path.basename(filePath)
      })

      await indexedFile.save()
    }

    return indexedFile
  }

  public async openFile(taggableId: number) {
    const target = await Indexable.findOneBy({ id: taggableId })

    if (!target) {
      throw new Error(`Could not find taggable with Id ${taggableId}`)
    }

    await shell.openPath(target.path)
  }
}

export const indexingManager = new IndexingManager()
