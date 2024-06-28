import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface ImageResult {
    data: string;
    width: number;
    height: number;
  }

  interface Window {
    fileApi: {
      getFiles: () => Promise<string[]>;
      getImage: (fileName: string) => Promise<ImageResult>;
    };
  }
}

contextBridge.exposeInMainWorld("fileApi", {
  getFiles: () => ipcRenderer.invoke("getFiles"),
  getImage: (fileName: string) => ipcRenderer.invoke("getImage", fileName),
});
