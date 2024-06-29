import { ipcMain, app } from "electron";
import { readdirSync, existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import { TaggableImage } from "./database/entities/TaggableImage";
import { Thumbnail } from "./database/entities/Thumbnail";
import path from "path";
import { Image } from "./database/entities/Image";

class ImageManager {
  private targetPath: string | undefined;

  public setPath(path: string) {
    this.targetPath = path;
  }

  public getPath() {
    return this.targetPath;
  }

  public async getImage(filePath: string) {
    let taggableImage = await TaggableImage.findOne({
      where: { path: filePath },
      relations: { thumbnail: true },
    });

    if (!taggableImage) {
      taggableImage = await this.buildEntity(filePath);
    }

    let thumbnail = taggableImage.thumbnail;

    if (!thumbnail) {
      thumbnail = await this.buildThumbnail(taggableImage);
    }

    return {
      data: await this.getBase64(thumbnail),
      width: thumbnail.width,
      height: thumbnail.height,
    };
  }

  private async buildEntity(filePath: string) {
    const image = await sharp(filePath).metadata();

    const taggableImage = TaggableImage.create({
      path: filePath,
      width: image.width,
      height: image.height,
    });

    await taggableImage.save();

    return taggableImage;
  }

  private async buildThumbnail(taggableImage: TaggableImage) {
    const thumbnailPath = app.isPackaged
      ? `${app.getPath("appData")}/impart/app/thumbnails`
      : `${app.getPath("appData")}/impart/dev/thumbnails`;

    if (!existsSync(thumbnailPath)) {
      mkdirSync(thumbnailPath);
    }

    const image = sharp(taggableImage.path)
      .resize({
        height: 400,
      })
      .png();

    const target = `${thumbnailPath}/${path.basename(taggableImage.path)}`;
    image.toFile(target);

    const buffer = await image.toBuffer({ resolveWithObject: true });

    const thumbnail = Thumbnail.create({
      path: target,
      width: buffer.info.width,
      height: buffer.info.height,
    });

    await thumbnail.save();

    taggableImage.thumbnail = thumbnail;
    await taggableImage.save();

    return thumbnail;
  }

  private async getBase64(image: Image) {
    return (await sharp(image.path).toBuffer()).toString("base64");
  }
}

export const imageManager = new ImageManager();
