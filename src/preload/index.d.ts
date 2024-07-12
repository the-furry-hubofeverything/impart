import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void

interface Image {
  id: number
  path: string
  width: number
  height: number
}

declare global {
  namespace Impart {
    interface ImageResult {
      data: string
      width: number
      height: number
    }

    interface Thumbnail extends Image {}

    interface TaggableImage extends Image {
      pinkynail: string
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
      getThumbnail: (imageId: number) => Promise<string>
    }

    fileApi: {
      getFiles: () => Promise<Impart.TaggableImage[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>

      onFileIndexed: CallbackFunc<Impart.FileIndexedEvent>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[]>
    }
  }
}
