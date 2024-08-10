import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void

declare global {
  namespace Impart {
    interface Dimensions {
      width: number
      height: number
    }

    interface Indexable {
      id: number
      path: string
      fileName: string
    }

    interface IndexedImage extends Indexable {
      dimensions: Dimensions
      pinkynail: string
    }

    interface IndexedFile extends Indexable {}

    interface BaseTaggable {
      id: number
      tags: Impart.Tag[]
    }

    interface Thumbnail {
      id: number
      dimensions: Dimensions
    }

    interface TaggableImage extends BaseTaggable {
      image: IndexedImage
      sourceFile?: IndexedFile
    }

    interface TaggableFile extends BaseTaggable {
      file: IndexedFile
    }

    type Taggable = TaggableImage | TaggableFile

    interface Directory {
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

    fileApi: {
      getThumbnail: (imageId: number) => Promise<string>
      openFile: (indexableId: number) => void

      onIndexingStarted: CallbackFunc<{ filesFound: number }>
      onFileIndexed: CallbackFunc<Impart.Taggable>
      onIndexingEnded: CallbackFunc<void>
    }

    taggableApi: {
      getTaggables: (tagIds?: number[]) => Promise<Impart.Taggable[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[]>
      editFileTags: (fileId: number, tagIds: number[]) => Promise<void>
    }
  }
}
