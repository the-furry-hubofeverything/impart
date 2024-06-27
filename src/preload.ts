import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    fileApi: {
      getFiles: () => Promise<string[]>;
      getImage: () => Promise<string>;
    };
  }
}

contextBridge.exposeInMainWorld("fileApi", {
  getFiles: () => ipcRenderer.invoke("getFiles"),
  getImage: () => ipcRenderer.invoke("getImage"),
});
