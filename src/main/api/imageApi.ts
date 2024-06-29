import { ipcMain } from "electron";
import { imageManager } from "../imageManager";

export function setupImageApi() {
  ipcMain.handle("image/getImage", (e, fileName: string) =>
    imageManager.getImage(fileName)
  );
}
