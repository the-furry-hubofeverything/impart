import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface ImageResult {
    data: string;
    width: number;
    height: number;
  }

  interface Window {
    iamgeApi: {
      getImage: (fileName: string) => Promise<ImageResult>;
    };
    fileApi: {
      getFiles: () => Promise<string[]>;
      indexDirectory: () => Promise<void>;
    };
  }
}

contextBridge.exposeInMainWorld("imageApi", {
  getFiles: () => ipcRenderer.invoke("getFiles"),
  getImage: (fileName: string) =>
    ipcRenderer.invoke("image/getImage", fileName),
});

contextBridge.exposeInMainWorld("fileApi", {
  getFiles: () => ipcRenderer.invoke("file/getFiles"),
  indexDirectory: () => ipcRenderer.invoke("file/indexDirectory"),
});
