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
        this.change()
      })
    )

    this.listeners.push(
      window.fileApi.onFileIndexed((t) => {
        this.filesIndexed++
        this.taggables.push(t)
        this.change()
      })
    )

    this.listeners.push(
      window.fileApi.onIndexingEnded(() => {
        setTimeout(() => {
          this.isIndexing = false
          this.change()
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
      this.change()
    }

    this.taggables = await window.taggableApi.getTaggables(tagsIds)
    this.change()
  }

  private change() {
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
