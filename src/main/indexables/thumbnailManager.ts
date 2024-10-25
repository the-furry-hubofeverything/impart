import { app, nativeImage } from 'electron'
import { TaggableImage } from '../database/entities/TaggableImage'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { v4 } from 'uuid'
import { Thumbnail } from '../database/entities/Thumbnail'
import { APP_DIR, DEV_DIR } from '../common/appDir'
import { thumbnailMessenger } from './thumbnailMessenger'

export namespace ThumbnailManager {
  export async function getThumbnail(taggableImageId: number) {
    const image = await TaggableImage.findOne({
      where: { id: taggableImageId },
      relations: { thumbnail: true }
    })

    if (!image) {
      return null
    }

    if (image.thumbnail && !existsSync(image.thumbnail.path)) {
      await image.thumbnail.remove()
      image.thumbnail = undefined
    }

    if (!image.thumbnail) {
      thumbnailMessenger.buildingThumbnail()
      image.thumbnail = await buildThumbnail(image)
      await image.save()
      thumbnailMessenger.thumbnailBuilt()
    }

    return image.thumbnail.path
  }

  async function buildThumbnail(image: TaggableImage) {
    const thumb = await nativeImage.createThumbnailFromPath(
      image.fileIndex.path.replaceAll('/', '\\').replaceAll('%20', ' '),
      {
        width: 400,
        height: 400
      }
    )

    const thumbnailPath = `${app.getPath('appData')}/impart/${app.isPackaged ? APP_DIR : DEV_DIR}/thumbnails`

    if (!existsSync(thumbnailPath)) {
      await mkdir(thumbnailPath)
    }

    const isJpeg =
      image.fileIndex.fileName.endsWith('jpg') || image.fileIndex.fileName.endsWith('jpg')
    const path = `${thumbnailPath}/${v4()}.${isJpeg ? 'jpg' : 'png'}`

    await writeFile(path, isJpeg ? thumb.toJPEG(100) : thumb.toPNG())

    return Thumbnail.create({
      path,
      dimensions: thumb.getSize()
    })
  }
}
