import { ipcMain, app } from "electron";
import { readdirSync, existsSync, mkdirSync } from "fs";
import sharp from "sharp";

export function setupImageApi() {
  ipcMain.handle("getFiles", () => {
    return readdirSync("../ArtistryTestFolder");
  });

  ipcMain.handle("getImage", async (e, fileName?: string) => {
    if (!fileName?.endsWith("png")) {
      return "";
    }

    const image = sharp(`../ArtistryTestFolder/${fileName}`)
      .resize({
        height: 400,
      })
      .png();

    const path = `${app.getPath("appData")}/artistry/thumbnails`;

    if (!existsSync(path)) {
      mkdirSync(path);
    }

    const target = `${path}/${fileName}`;
    console.log("Attempting to save to ", target);

    image.toFile(target, (error, info) => {
      if (error) {
        console.error("It didn't work:", error);
      } else {
        console.log("Saved file to ", target);
      }
    });

    const buffer = await image.toBuffer({ resolveWithObject: true });

    return {
      data: buffer.data.toString("base64"),
      width: buffer.info.width,
      height: buffer.info.height,
    };
  });
}
