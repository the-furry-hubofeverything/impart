import { isTaggableImage } from '@renderer/common/taggable'

export interface TaggableState {
  isIndexing: boolean
  filesIndexed: number
  total: number
  taggables: Impart.Taggable[]
}

type OnChangeCallback = (state: TaggableState) => void

export class TaggableManager {
  private listeners: (() => void)[] = []
  private onChange?: OnChangeCallback

  private isIndexing = false
  private filesIndexed = 0
  private total = 0

  private taggables: Impart.Taggable[] = []

  public static getInitialState(): TaggableState {
    return {
      isIndexing: false,
      filesIndexed: 0,
      total: 0,
      taggables: []
    }
  }

  public constructor() {
    this.listeners.push(
      window.fileApi.onIndexingStarted((e) => {
        this.isIndexing = true
        this.filesIndexed = 0
        this.total = e.filesFound
        this.sync()
      })
    )

    this.listeners.push(
      window.fileApi.onFileIndexed((indexedTaggable) => {
        this.filesIndexed++

        if (isTaggableImage(indexedTaggable)) {
          this.taggables.push(indexedTaggable)

          //Remove the source from the display in case it beat the file here
          if (indexedTaggable.source != null) {
            const fileIndex = this.taggables.findIndex((t) => t.id === indexedTaggable.source?.id)

            if (fileIndex != -1) {
              this.taggables.splice(fileIndex, 1)
            }
          }
        } else if (
          !this.taggables.some((t) => isTaggableImage(t) && t.source?.id == indexedTaggable.id)
        ) {
          //Otherwise, since we have a file, we only want to add it if it isn't the source of
          // another image
          this.taggables.push(indexedTaggable)
        }

        this.sync()
      })
    )

    this.listeners.push(
      window.fileApi.onSourceFileAssociated(({ file, image }) => {
        //Find the image and update its source
        const taggableImage = this.taggables.find((t) => t.id === image.id)
        if (taggableImage && isTaggableImage(taggableImage)) {
          taggableImage.source = file
        }

        //Remove the taggable file if it's currently being displayed
        const fileIndex = this.taggables.findIndex((t) => t.id === file.id)

        if (fileIndex != -1) {
          this.taggables.splice(fileIndex, 1)
        }

        this.sync()
      })
    )

    this.listeners.push(
      window.fileApi.onIndexingEnded(() => {
        setTimeout(() => {
          this.isIndexing = false
          this.sync()
        }, 3000)
      })
    )
  }

  public setOnChange(callback: OnChangeCallback) {
    this.onChange = callback
  }

  public async fetchAll(tagsIds?: number[]) {
    if (this.taggables.length > 0) {
      this.taggables = []
      this.sync()
    }

    this.taggables = await window.taggableApi.getTaggables(tagsIds)
    this.sync()
  }

  private sync() {
    this.onChange &&
      this.onChange({
        isIndexing: this.isIndexing,
        filesIndexed: this.filesIndexed,
        total: this.total,
        taggables: this.taggables
      })
  }

  public destroy() {
    this.listeners.forEach((removeListener) => removeListener())
  }
}
