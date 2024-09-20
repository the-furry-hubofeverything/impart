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
      window.fileApi.onStepProgress(() => {
        this.filesIndexed++
        this.sync()
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

  public async fetchTaggables(options?: Impart.FetchTaggablesOptions) {
    this.taggables = await window.taggableApi.getTaggables(options)
    this.sync()
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
