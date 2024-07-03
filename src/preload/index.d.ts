import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void

declare global {
  namespace Impart {
    interface ImageResult {
      data: string
      width: number
      height: number
    }

    interface FileIndexedEvent {
      amountIndexed: number
      total: number
    }

    interface IndexedDirectory {
      path: string
    }

    interface Tag {
      id: number
      label: string
      color: string
    }

    interface TagGroup {
      id: number
      label: string
      tags: Tag[]
    }
  }

  interface Window {
    electron: ElectronAPI

    imageApi: {
      getImage: (fileName: string) => Promise<Impart.ImageResult>
    }

    fileApi: {
      getFiles: () => Promise<string[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>

      onFileIndexed: CallbackFunc<Impart.FileIndexedEvent>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[]>
    }
  }
}
