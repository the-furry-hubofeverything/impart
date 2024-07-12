import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('imageApi', {
  getFiles: () => ipcRenderer.invoke('getFiles'),
  getThumbnail: (fileName: string) => ipcRenderer.invoke('image/getThumbnail', fileName)
})

contextBridge.exposeInMainWorld('fileApi', {
  getFiles: () => ipcRenderer.invoke('file/getFiles'),
  selectAndIndexDirectory: () => ipcRenderer.invoke('file/selectAndIndexDirectory'),
  getDirectories: () => ipcRenderer.invoke('file/getDirectories'),

  onFileIndexed: (callback: (values: any) => void) =>
    ipcRenderer.on('file/fileIndexed', (_event, values) => callback(values))
})

contextBridge.exposeInMainWorld('tagApi', {
  getGroups: () => ipcRenderer.invoke('tag/getGroups')
})
