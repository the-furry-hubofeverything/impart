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
  openFile: generateCommand('file/openFile')
})

contextBridge.exposeInMainWorld('taskApi', {
  onSequenceStarted: generateCallback('task/sequenceStarted'),
  onItemAddedToSequence: generateCallback('task/itemAddedToSequence'),
  onTaskStarted: generateCallback('task/taskStarted'),
  onStepTaken: generateCallback('task/stepTaken'),
  onTaskFinished: generateCallback('task/taskFinished'),
  onSequenceFinished: generateCallback('task/sequenceFinished')
})

contextBridge.exposeInMainWorld('taggableApi', {
  getTaggables: generateEndpoint('taggable/getTaggables'),
  getAllTaggableYears: generateEndpoint('taggable/getAllTaggableYears'),
  createStack: generateEndpoint('taggable/createStack'),
  setHidden: generateEndpoint('taggable/setHidden')
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
  indexAll: generateEndpoint('index/indexAll'),
  selectDirectory: generateEndpoint('index/selectDirectory'),
  updateDirectories: generateEndpoint('index/updateDirectories'),
  getDirectories: generateEndpoint('index/getDirectories')
})

contextBridge.exposeInMainWorld('thumbnailApi', {
  onBuildingThumbnail: generateCallback('thumbnail/buildingThumbnail'),
  onThumbnailBuilt: generateCallback('thumbnail/thumbnailBuilt')
})
