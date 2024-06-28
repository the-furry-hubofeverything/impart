import { ipcMain, app } from "electron";
import { readdirSync, existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import { TaggableImage } from "./database";

class ImageManager {
  public async getImage(fileName: string) {
    const path = `../ArtistryTestFolder/${fileName}`;
    const target = await TaggableImage.findOne({ where: { path } });

    const image = sharp(path)
      .resize({
        height: 400,
      })
      .png();

    // const thumbnailPath = `${app.getPath("appData")}/artistry/thumbnails`;

    // if (!existsSync(thumbnailPath)) {
    //   mkdirSync(path);
    //}

    // const target = `${path}/${fileName}`;
    // console.log("Attempting to save to ", target);

    // image.toFile(target, (error, info) => {
    //   if (error) {
    //     console.error("It didn't work:", error);
    //   } else {
    //     console.log("Saved file to ", target);
    //   }
    // });

    const buffer = await image.toBuffer({ resolveWithObject: true });

    return {
      data: buffer.data.toString("base64"),
      width: buffer.info.width,
      height: buffer.info.height,
    };
  }
}

export const imageManager = new ImageManager();
