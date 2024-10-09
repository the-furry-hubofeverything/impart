import { delay } from '../common/sleep'
import { Tag } from '../database/entities/Tag'
import { TagGroup } from '../database/entities/TagGroup'
import { Taggable } from '../database/entities/Taggable'
import { TaggableImage } from '../database/entities/TaggableImage'
import { In } from 'typeorm'
import { taskQueue } from '../task/taskQueue'

export class TagManager {
  public async getTagGroups() {
    const groups = await TagGroup.find({
      order: {
        groupOrder: 'ASC'
      }
    })

    return groups
  }

  public async setFileTags(taggableId: number, tagIds: number[]) {
    const [file, tags] = await Promise.all([
      Taggable.findOneBy({ id: taggableId }),
      Tag.findBy({ id: In(tagIds) })
    ])

    if (!file) {
      throw new Error(`Could not find taggable with id ${taggableId}`)
    }

    file.tags = tags
    await file.save()
  }

  public async bulkTag(taggableIds: number[], tagIds: number[]) {
    taskQueue.add({
      steps: async () => {
        const [taggables, tags] = await Promise.all([
          Taggable.find({ where: { id: In(taggableIds) }, relations: { tags: true } }),
          Tag.findBy({ id: In(tagIds) })
        ])

        return taggables.map((t) => () => this.addTagsToTaggable(t, tags))
      },
      delayPerItem: 10,
      type: 'bulkTag'
    })
  }

  public async bulkTagTaggables(taggables: Taggable[] | (() => Promise<Taggable[]>), tags: Tag[]) {
    taskQueue.add({
      steps: async () => {
        const actualTaggables = typeof taggables === 'function' ? await taggables() : taggables
        return actualTaggables.map((t) => () => this.addTagsToTaggable(t, tags))
      },
      delayPerItem: 10,
      type: 'bulkTag'
    })
  }

  public async addTags(taggableId: number, tagIds: number[]) {
    const [taggable, tags] = await Promise.all([
      Taggable.findOneByOrFail({ id: taggableId }),
      Tag.findBy({ id: In(tagIds) })
    ])

    await this.addTagsToTaggable(taggable, tags)
  }

  private async addTagsToTaggable(taggable: Taggable, tags: Tag[]) {
    let added = false

    tags.forEach((addedTag) => {
      if (!taggable.tags.some((existingTag) => existingTag.id === addedTag.id)) {
        added = true
        taggable.tags.push(addedTag)
      }
    })

    if (added) {
      await taggable.save()
    }
  }

  public async createGroup() {
    const maxOrder = await TagGroup.maximum('groupOrder', {})

    const group = TagGroup.create({
      groupOrder: (maxOrder ?? 0) + 1
    })
    await group.save()

    return group
  }

  public async editGroup(id: number, label?: string, defaultTagColor?: string) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })

    groupEntity.label = label
    groupEntity.defaultTagColor = defaultTagColor

    await groupEntity.save()

    return groupEntity
  }

  public async deleteGroup(id: number) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })
    await groupEntity.remove()
    return true
  }

  public async createTag(groupId: number) {
    const [maxOrder, tagGroup] = await Promise.all([
      Tag.maximum('tagOrder', { group: { id: groupId } }),
      TagGroup.findOneBy({ id: groupId })
    ])

    if (!tagGroup) {
      throw new Error(`Could not find tag group with id ${groupId}`)
    }

    const tag = Tag.create({
      tagOrder: (maxOrder ?? 0) + 1,
      color: tagGroup.defaultTagColor,
      group: tagGroup
    })

    await tag.save()

    return tag
  }

  public async editTag(tagId: number, label?: string, color?: string) {
    const tagEntity = await Tag.findOneByOrFail({ id: tagId })

    tagEntity.label = label
    tagEntity.color = color

    await tagEntity.save()

    return tagEntity
  }

  public async deleteTag(id: number) {
    const tagEntity = await Tag.findOneByOrFail({ id })
    await tagEntity.remove()
    return true
  }
}

export const tagManager = new TagManager()
