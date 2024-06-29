import { ipcMain } from "electron";
import { fileManager } from "../file/fileManager";

export function setupFileApi() {
  ipcMain.handle("file/getFiles", () => fileManager.getFiles());

  ipcMain.handle("file/selectAndIndexDirectory", () =>
    fileManager.selectAndIndexDirectory()
  );
}
