import { Tag } from './entities/Tag'
import { TagGroup } from './entities/TagGroup'

export function seedGroups() {
  TagGroup.create({
    label: 'Characters',
    groupOrder: 1,
    tags: [
      Tag.create({ label: 'Wereguar', color: '#3f3f46' }),
      Tag.create({ label: 'Xenon', color: '#3f3f46' })
    ]
  }).save()

  TagGroup.create({
    label: 'Completeness',
    groupOrder: 2,
    tags: [
      Tag.create({ label: 'Sketch', color: '#8b5f8d' }),
      Tag.create({ label: 'Render', color: '#8b5f8d' }),
      Tag.create({ label: 'Scene', color: '#8b5f8d' })
    ]
  }).save()
}
