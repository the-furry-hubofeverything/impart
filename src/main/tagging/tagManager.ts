import { Tag } from '../database/entities/Tag'
import { TagGroup } from '../database/entities/TagGroup'
import { TaggableImage } from '../database/entities/TaggableImage'
import { In } from 'typeorm'

export class TagManager {
  public async getTagGroups() {
    const groups = await TagGroup.find({
      order: {
        groupOrder: 'ASC'
      }
    })

    return groups.map((g) => ({
      id: g.id,
      label: g.label,
      tags: g.tags.map((t) => ({ id: t.id, label: t.label, color: t.color }))
    }))
  }

  public async setFileTags(fileId: number, tagsIds: number[]) {
    const [file, tags] = await Promise.all([
      TaggableImage.findOneBy({ id: fileId }),
      Tag.findBy({ id: In(tagsIds) })
    ])

    if (!file) {
      throw new Error(`Could not find file with id ${fileId}`)
    }

    file.tags = tags
    await file.save()
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

  public async createTag(groupId: number) {
    const maxOrder = await Tag.maximum('tagOrder', { group: { id: groupId } })

    const tag = Tag.create({
      tagOrder: (maxOrder ?? 0) + 1,
      group: { id: groupId }
    })

    await tag.save()

    return tag
  }
}

export const tagManager = new TagManager()
