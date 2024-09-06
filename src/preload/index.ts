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

  onIndexingStepStarted: generateCallback('file/indexingStarted'),
  onFileIndexed: generateCallback('file/fileIndexed'),
  onSourceFileAssociated: generateCallback('file/sourceFileAssociated'),
  onStepProgress: generateCallback('file/madeStepProgress'),
  onIndexingEnded: generateCallback('file/indexingEnded')
})

contextBridge.exposeInMainWorld('taggableApi', {
  getTaggables: generateEndpoint('taggable/getTaggables')
})

contextBridge.exposeInMainWorld('tagApi', {
  getGroups: generateEndpoint('tag/getGroups'),
  editFileTags: generateEndpoint('tag/editFileTags'),
  bulkTag: generateEndpoint('tag/bulkTag'),

  createGroup: generateEndpoint('tag/createGroup'),
  editGroup: generateEndpoint('tag/editGroup'),
  deleteGroup: generateEndpoint('tag/deleteGroup'),

  createTag: generateEndpoint('tag/createTag'),
  editTag: generateEndpoint('tag/editTag'),
  deleteTag: generateEndpoint('tag/deleteTag')
})

contextBridge.exposeInMainWorld('indexApi', {
  selectAndIndexDirectory: generateEndpoint('index/selectAndIndexDirectory'),
  getDirectories: generateEndpoint('index/getDirectories'),
  deleteDirectory: generateEndpoint('index/deleteDirectory')
})
