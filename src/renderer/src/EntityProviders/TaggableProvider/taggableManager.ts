import { isTaggableImage } from '@renderer/common/taggable'

export interface TaggableState {
  isIndexing: boolean
  indexingStep?: Impart.IndexingStep
  filesIndexed: number
  total: number
  taggables: Impart.Taggable[]
}

type OnChangeCallback = (state: TaggableState) => void
type OnFinishIndexingCallback = () => void

export class TaggableManager {
  private listeners: (() => void)[] = []
  private onChange?: OnChangeCallback
  private onFinishIndexing?: OnFinishIndexingCallback

  private fetchOptions?: Impart.FetchTaggablesOptions
  private page = 1
  private doneFetching = false

  private isIndexing = false
  private indexingStep?: Impart.IndexingStep
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
      window.fileApi.onIndexingStepStarted((e) => {
        this.isIndexing = true
        this.indexingStep = e.step
        this.filesIndexed = 0
        this.total = e.filesFound
        this.sync()
      })
    )

    this.listeners.push(
      window.fileApi.onFileIndexed((indexedTaggable) => {
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
      window.fileApi.onStepProgress(() => {
        this.filesIndexed++
      })
    )

    this.listeners.push(
      window.fileApi.onIndexingEnded(() => {
        this.onFinishIndexing && this.onFinishIndexing()
        this.indexingStep = undefined
        this.isIndexing = false
        this.sync()
      })
    )
  }

  public setOnChange(callback: OnChangeCallback) {
    this.onChange = callback
  }

  public setOnFinishIndexing(callback: OnFinishIndexingCallback) {
    this.onFinishIndexing = callback
  }

  public async startNewFetch(options?: Impart.FetchTaggablesOptions) {
    this.taggables = []
    this.sync()

    this.page = 0
    this.fetchOptions = options
    this.fetchNext()
    this.sync()
  }

  public async fetchNext() {
    if (this.doneFetching) {
      return true
    }

    this.page++
    const taggables = await window.taggableApi.getTaggables(this.page, this.fetchOptions)

    if (taggables.length < 100) {
      this.doneFetching = true
    }

    this.taggables = this.taggables.concat(taggables)
    this.sync()

    return this.doneFetching
  }

  private sync() {
    this.onChange &&
      this.onChange({
        isIndexing: this.isIndexing,
        indexingStep: this.indexingStep,
        filesIndexed: this.filesIndexed,
        total: this.total,
        taggables: this.taggables
      })
  }

  public destroy() {
    this.listeners.forEach((removeListener) => removeListener())
  }
}
