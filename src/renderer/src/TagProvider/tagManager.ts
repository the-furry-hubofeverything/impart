export interface ManagedTagGroup extends Impart.TagGroup {
  freshlyCreated: boolean
}

export interface TagState {
  groups: ManagedTagGroup[]
}

type OnChangeCallback = (state: TagState) => void

export class TagManager {
  private groups: ManagedTagGroup[] = []
  private onChange?: OnChangeCallback

  public static getInitialState(): TagState {
    return {
      groups: []
    }
  }

  public setOnChange(callback: OnChangeCallback) {
    this.onChange = callback
  }

  public async loadGroups() {
    this.groups = (await window.tagApi.getGroups()).map((g) => ({
      freshlyCreated: false,
      ...g
    }))
    this.sync()
  }

  private sync() {
    this.onChange &&
      this.onChange({
        groups: this.groups
      })
  }
}
