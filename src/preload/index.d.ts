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

    interface BaseTaggable {
      id: number
      tags: Impart.Tag[]
    }

    interface Thumbnail {
      id: number
      image: Image
    }

    interface TaggableImage extends BaseTaggable {
      image: Image
      pinkynail: string
    }

    interface TaggableFile extends BaseTaggable {
      path: string
      fileName: string
    }

    type Taggable = TaggableImage | TaggableFile

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
      getFiles: (tagIds?: number[]) => Promise<Impart.Taggable[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>

      openFile: (fileId: number) => void

      onIndexingStarted: CallbackFunc<{ filesFound: number }>
      onFileIndexed: CallbackFunc<Impart.Taggable>
      onIndexingEnded: CallbackFunc<void>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[]>
      editFileTags: (fileId: number, tagIds: number[]) => Promise<void>
    }
  }
}
