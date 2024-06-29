import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('imageApi', {
      getFiles: () => ipcRenderer.invoke('getFiles'),
      getImage: (fileName: string) => ipcRenderer.invoke('image/getImage', fileName)
    })

    contextBridge.exposeInMainWorld('fileApi', {
      getFiles: () => ipcRenderer.invoke('file/getFiles'),
      selectAndIndexDirectory: () => ipcRenderer.invoke('file/selectAndIndexDirectory'),

      onFileIndexed: (callback: (values: any) => void) =>
        ipcRenderer.on('file/fileIndexed', (_event, values) => callback(values))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
