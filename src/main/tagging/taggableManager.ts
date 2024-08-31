import { Taggable } from '../database/entities/Taggable'

class TaggableManager {
  public async getTaggables(tagIds?: number[]) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (tagIds && tagIds.length > 0) {
      Array.from(tagIds).forEach((t, index) => {
        const alias = `tags${index}`
        const variable = `id${index}`
        query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
          [variable]: t
        })
      })
    }

    query
      .leftJoin('files.images', 'associatedImages')
      .where('associatedImages.id IS NULL')
      .orderBy('files.fileIndex.fileName')

    return await query.getMany()
  }
}

export const taggableManager = new TaggableManager()
