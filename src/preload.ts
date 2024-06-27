import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    fileApi: {
      getFiles: () => Promise<string[]>;
      getImage: (fileName: string) => Promise<string>;
    };
  }
}

contextBridge.exposeInMainWorld("fileApi", {
  getFiles: () => ipcRenderer.invoke("getFiles"),
  getImage: (fileName: string) => ipcRenderer.invoke("getImage", fileName),
});
