import { Tag } from './database/entities/Tag'
import { TagGroup } from './database/entities/TagGroup'
import { TaggableImage } from './database/entities/TaggableImage'
import { In } from 'typeorm'

class TagManager {
  public async getTagGroups() {
    const groups = await TagGroup.find({
      order: {
        order: 'ASC'
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
}

export const tagManager = new TagManager()
