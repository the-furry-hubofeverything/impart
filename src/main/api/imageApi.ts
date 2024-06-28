import { ipcMain } from "electron";
import { readdirSync } from "fs";
import { imageManager } from "../imageManager";

export function setupImageApi() {
  ipcMain.handle("getFiles", () => readdirSync("../ArtistryTestFolder"));

  ipcMain.handle("getImage", (e, fileName: string) =>
    imageManager.getImage(fileName)
  );
}
