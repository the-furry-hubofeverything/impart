import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void

declare global {
  namespace Impart {
    interface Dimensions {
      width: number
      height: number
    }

    interface FileIndex {
      path: string
      fileName: string
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //TAGGABLE
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    interface BaseTaggable {
      id: number
      tags: Impart.Tag[]
    }

    interface TaggableImage extends BaseTaggable {
      fileIndex: FileIndex
      dimensions: Dimensions
    }

    interface TaggableFile extends BaseTaggable {
      fileIndex: FileIndex
    }

    type Taggable = TaggableImage | TaggableFile

    interface Directory {
      path: string
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //TAGS
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    interface Tag {
      id: number
      label?: string
      tagOrder: number
      color?: string
    }

    interface TagGroup {
      id: number
      label?: string
      groupOrder: number
      defaultTagColor?: string
      tags?: Tag[]
    }
  }

  interface Window {
    electron: ElectronAPI

    fileApi: {
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
      createGroup: () => Promise<Impart.TagGroup>
      editGroup: (id: number, label?: string, defaultTagColor?: string) => Promise<Impart.TagGroup>
      createTag: (groupId: number) => Promise<Impart.Tag>
      editTag: (tagId: number, label?: string, color?: string) => Promise<Impart.Tag>
    }
  }
}
