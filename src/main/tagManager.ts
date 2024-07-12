import { TagGroup } from './database/entities/TagGroup'

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
}

export const tagManager = new TagManager()
