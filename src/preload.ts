import { contextBridge, ipcRenderer } from "electron";

type CallbackFunc<Payload> = (
  callback: (values: FileIndexedEvent) => void
) => () => void;

declare global {
  interface ImageResult {
    data: string;
    width: number;
    height: number;
  }

  interface FileIndexedEvent {
    filesIndexed: number;
    total: number;
  }

  interface Window {
    imageApi: {
      getImage: (fileName: string) => Promise<ImageResult>;
    };
    fileApi: {
      getFiles: () => Promise<string[]>;
      selectAndIndexDirectory: () => Promise<void>;
      onFileIndexed: CallbackFunc<FileIndexedEvent>;
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
  selectAndIndexDirectory: () =>
    ipcRenderer.invoke("file/selectAndIndexDirectory"),

  onFileIndexed: (callback: (values: any) => void) =>
    ipcRenderer.on("file/fileIndexed", (event, values) => callback(values)),
});
