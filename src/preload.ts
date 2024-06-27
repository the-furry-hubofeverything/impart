import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    fileApi: {
      getFiles: () => Promise<string[]>;
    };
  }
}

contextBridge.exposeInMainWorld("fileApi", {
  getFiles: () => ipcRenderer.invoke("getFiles"),
});
