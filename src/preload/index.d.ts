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

    interface Directory {
      path: string
      autoTags: number[]
    }

    interface CountedDirectory extends Directory {
      taggableCount: number
    }

    interface BaseTaggable {
      id: number
      tags: Impart.Tag[]
      dateModified: Date
    }

    interface TaggableImage extends BaseTaggable {
      fileIndex: FileIndex
      dimensions: Dimensions
      source?: TaggableFile
    }

    interface TaggableFile extends BaseTaggable {
      fileIndex: FileIndex
    }

    interface TaggableStack extends BaseTaggable {
      taggables: Taggable[]
      name: string
      cover?: TaggableImage
    }

    type Taggable = TaggableImage | TaggableFile | TaggableStack

    interface FetchTaggablesOptions {
      tagIds?: number[]
      order?: 'alpha' | 'date'
      search?: string
      year?: number
      stackId?: number
      onlyHidden?: boolean
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

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //MISC
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    type TaskType = 'indexing' | 'sourceAssociation' | 'bulkTag' | 'removing'

    interface Error {
      message: string
      name?: string
      stack?: string
    }
  }

  interface Window {
    electron: ElectronAPI

    fileApi: {
      openFile: (indexableId: number) => void
      openFileLocation: (indexableId: number) => void
    }

    taggableApi: {
      getTaggables: (
        options?: Impart.FetchTaggablesOptions
      ) => Promise<Impart.Taggable[] | Impart.Error>
      getAllTaggableYears: () => Promise<number[] | Impart.Error>

      setHidden: (ids: number[], hidden: boolean) => Promise<void | Impart.Error>
    }

    stackApi: {
      create: (
        name: string,
        taggableIds: number[],
        coverId: number,
        parentStackId?: number
      ) => Promise<void | Impart.Error>
      addToStack: (taggableIds: number[], stackId: number) => Promise<void | Impart.Error>
      moveToHome: (taggableIds: number[], currentStackId: number) => Promise<void | Impart.Error>
    }

    taskApi: {
      onSequenceStarted: CallbackFunc<void>
      onItemAddedToSequence: CallbackFunc<void>
      onTaskStarted: CallbackFunc<{ type: Impart.TaskType; steps: number }>
      onStepTaken: CallbackFunc<void>
      onTaskFinished: CallbackFunc<void>
      onSequenceFinished: CallbackFunc<void>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[] | Impart.Error>
      editFileTags: (taggableId: number, tagIds: number[]) => Promise<void | Impart.Error>
      bulkTag: (taggableIds: number[], tagIds: number[]) => Promise<void | Impart.Error>
      addTags: (taggableId: number, tagIds: number[]) => Promise<void | Impart.Error>

      createGroup: () => Promise<Impart.TagGroup | Impart.Error>
      editGroup: (
        id: number,
        label?: string,
        defaultTagColor?: string
      ) => Promise<Impart.TagGroup | Impart.Error>
      deleteGroup: (id: number) => Promise<true | Impart.Error>

      createTag: (groupId: number) => Promise<Impart.Tag | Impart.Error>
      editTag: (tagId: number, label?: string, color?: string) => Promise<Impart.Tag | Impart.Error>
      deleteTag: (id: number) => Promise<true | Impart.Error>
    }

    indexApi: {
      indexAll: () => Promise<void>
      selectDirectory: () => Promise<string | undefined>
      updateDirectories: (payload: Impart.Directory[]) => Promise<void | Impart.Error>
      getDirectories: () => Promise<Impart.CountedDirectory[] | Impart.Error>
    }

    thumbnailApi: {
      onBuildingThumbnail: CallbackFunc<void>
      onThumbnailBuilt: CallbackFunc<void>
    }
  }
}
