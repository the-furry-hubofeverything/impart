import { app, shell } from 'electron'
import { existsSync, mkdirSync } from 'fs'
import sharp from 'sharp'
import { Thumbnail } from '../database/entities/Thumbnail'
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

  public async getThumbnail(imageId: number) {
    const taggableImage = await TaggableImage.findOne({
      where: { id: imageId },
      relations: { thumbnail: true }
    })

    if (!taggableImage) {
      throw new Error(`Could not find TaggableImage with ID ${imageId}`)
    }

    let thumbnail = taggableImage.thumbnail

    if (!thumbnail) {
      thumbnail = await this.buildThumbnail(taggableImage.fileIndex.path)

      taggableImage.thumbnail = thumbnail
      taggableImage.save()
    }

    return await this.getBase64(taggableImage)
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
    const image = await sharp(filePath).metadata()

    const [thumbnail, pinkynail] = await Promise.all([
      this.buildThumbnail(filePath),
      this.buildPinkynail(filePath)
    ])

    const indexedImage = TaggableImage.create({
      fileIndex: {
        path: filePath,
        fileName: path.basename(filePath)
      },
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

  private async getBase64(image: TaggableImage) {
    return (await sharp(image.fileIndex.path).toBuffer()).toString('base64')
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
