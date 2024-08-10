import { contextBridge, ipcRenderer } from 'electron'

function generateEndpoint(channel: string) {
  return (...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

function generateCommand(channel: string) {
  return (...args: any[]) => ipcRenderer.send(channel, ...args)
}

function generateCallback(channel: string) {
  return (callback: (values: any) => void) => {
    const func = (_event: Electron.IpcRendererEvent, values: any) => callback(values)
    ipcRenderer.on(channel, func)

    return () => {
      ipcRenderer.removeListener(channel, func)
    }
  }
}

contextBridge.exposeInMainWorld('fileApi', {
  getThumbnail: generateEndpoint('file/getThumbnail'),
  openFile: generateCommand('file/openFile'),

  onIndexingStarted: generateCallback('file/indexingStarted'),
  onFileIndexed: generateCallback('file/fileIndexed'),
  onIndexingEnded: generateCallback('file/indexingEnded')
})

contextBridge.exposeInMainWorld('taggableApi', {
  getTaggables: generateEndpoint('taggable/getTaggables'),
  selectAndIndexDirectory: generateEndpoint('taggable/selectAndIndexDirectory'),
  getDirectories: generateEndpoint('taggable/getDirectories')
})

contextBridge.exposeInMainWorld('tagApi', {
  getGroups: generateEndpoint('tag/getGroups'),
  editFileTags: generateEndpoint('tag/editFileTags')
})
