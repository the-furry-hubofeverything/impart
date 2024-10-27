import { Tag } from '../database/entities/Tag'
import { TagGroup } from '../database/entities/TagGroup'
import { Taggable } from '../database/entities/Taggable'
import { FindOptionsWhere, In } from 'typeorm'
import { taskQueue } from '../task/taskQueue'
import { ImpartTask, TaskType } from '../task/impartTask'
import { Directory } from '../database/entities/Directory'
import { TaggableFile } from '../database/entities/TaggableFile'
import { TaggableImage } from '../database/entities/TaggableImage'

export namespace TagManager {
  export async function getTagGroups() {
    const groups = await TagGroup.find({
      order: {
        groupOrder: 'ASC'
      }
    })

    return groups
  }

  export async function createGroup() {
    const maxOrder = await TagGroup.maximum('groupOrder', {})

    const group = TagGroup.create({
      groupOrder: (maxOrder ?? 0) + 1
    })
    await group.save()

    return group
  }

  export async function editGroup(id: number, label?: string, defaultTagColor?: string) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })

    groupEntity.label = label
    groupEntity.defaultTagColor = defaultTagColor

    await groupEntity.save()

    return groupEntity
  }

  export async function deleteGroup(id: number) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })
    await groupEntity.remove()
    return true
  }

  export async function createTag(groupId: number) {
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

  export async function editTag(tagId: number, label?: string, color?: string) {
    const tagEntity = await Tag.findOneByOrFail({ id: tagId })

    tagEntity.label = label
    tagEntity.color = color

    await tagEntity.save()

    return tagEntity
  }

  export async function deleteTag(id: number) {
    const tagEntity = await Tag.findOneByOrFail({ id })
    await tagEntity.remove()
    return true
  }
}
