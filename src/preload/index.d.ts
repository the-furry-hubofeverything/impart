import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void

declare global {
  namespace Impart {
    interface Image {
      path: string
      fileName: string
      width: number
      height: number
    }

    interface Taggable {
      id: number
      tags: Impart.Tag[]
    }

    interface Thumbnail {
      id: number
      image: Image
    }

    interface TaggableImage extends Taggable {
      image: Image
      pinkynail: string
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
      getFiles: (tagIds?: number[]) => Promise<Impart.TaggableImage[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>

      openFile: (fileId: number) => void

      onIndexingStarted: CallbackFunc<{ filesFound: number }>
      onFileIndexed: CallbackFunc<Impart.TaggableImage>
      onIndexingEnded: CallbackFunc<void>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[]>
      editFileTags: (fileId: number, tagIds: number[]) => Promise<void>
    }
  }
}
