import { Tag } from '../database/entities/Tag'
import { TagGroup } from '../database/entities/TagGroup'

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

  export async function reorderGroups(moveId: number, beforeId: number | 'end') {
    const groups = await TagGroup.find({ order: { groupOrder: 'ASC' } })
    const targetIndex = groups.findIndex((g) => g.id === moveId)
    let beforeIndex = beforeId === 'end' ? -1 : groups.findIndex((g) => g.id === beforeId)

    //
    if (targetIndex === beforeIndex || targetIndex === beforeIndex - 1) {
      return
    }

    //When moving a group up the list, the move function removes it and then re-adds it
    // to the list at the new spot, but the removal step actually brings all the items
    // one index back, resulting it in getting injected one ahead. To compensate for this,
    // if we're moving up the list, we subtract the target index
    if (targetIndex < beforeIndex) {
      beforeIndex--
    }

    if (targetIndex == -1) {
      throw new Error(`Could not find tag group with id ${moveId}`)
    }

    if (beforeId !== 'end' && beforeIndex === -1) {
      throw new Error(`Could not find tag group with id ${beforeId}`)
    }

    const updatedOrder = arrayMoveImmutable(groups, targetIndex, beforeIndex)

    await Promise.all(
      updatedOrder.map(async (group, index) => {
        group.groupOrder = index
        await group.save()
      })
    )
  }

  //Copied from https://github.com/sindresorhus/array-move/blob/main/index.js
  // since the package wasn't working for some reason
  function arrayMoveMutable<T>(array: T[], fromIndex: number, toIndex: number) {
    const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

      const [item] = array.splice(fromIndex, 1)
      array.splice(endIndex, 0, item)
    }
  }

  function arrayMoveImmutable<T>(array: T[], fromIndex: number, toIndex: number) {
    const newArray = [...array]
    arrayMoveMutable(newArray, fromIndex, toIndex)
    return newArray
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
