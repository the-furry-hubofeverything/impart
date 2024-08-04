import { contextBridge, ipcRenderer } from 'electron'

function generateCallback(channel: string) {
  return (callback: (values: any) => void) => {
    const func = (_event: Electron.IpcRendererEvent, values: any) => callback(values)
    ipcRenderer.on(channel, func)

    return () => {
      ipcRenderer.removeListener(channel, func)
    }
  }
}

contextBridge.exposeInMainWorld('imageApi', {
  getFiles: () => ipcRenderer.invoke('getFiles'),
  getThumbnail: (fileName: string) => ipcRenderer.invoke('image/getThumbnail', fileName)
})

contextBridge.exposeInMainWorld('fileApi', {
  getFiles: () => ipcRenderer.invoke('file/getFiles'),
  selectAndIndexDirectory: () => ipcRenderer.invoke('file/selectAndIndexDirectory'),
  getDirectories: () => ipcRenderer.invoke('file/getDirectories'),

  openFile: (fileId: number) => ipcRenderer.send('file/openFile', fileId),

  onIndexingStarted: generateCallback('file/indexingStarted'),
  onFileIndexed: generateCallback('file/fileIndexed'),
  onIndexingEnded: generateCallback('file/indexingEnded')
})

contextBridge.exposeInMainWorld('tagApi', {
  getGroups: () => ipcRenderer.invoke('tag/getGroups'),
  editFileTags: (...args: any[]) => ipcRenderer.invoke('tag/editFileTags', ...args)
})
