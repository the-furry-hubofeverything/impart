import { ipcMain } from "electron";
import { fileManager } from "../fileManager";

export function setupFileApi() {
  ipcMain.handle("file/getFiles", () => fileManager.getFiles());
  ipcMain.handle("file/indexDirectory", () => fileManager.indexDirectory());
}
