import { Taggable } from '../database/entities/Taggable'

export interface FetchTaggablesOptions {
  tagIds?: number[]
}

export class TaggableManager {
  public async getTaggables(page: number, options?: FetchTaggablesOptions) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (options) {
      const { tagIds } = options
      if (tagIds && tagIds.length > 0) {
        Array.from(tagIds).forEach((t, index) => {
          const alias = `tags${index}`
          const variable = `id${index}`
          query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
            [variable]: t
          })
        })
      }
    }

    query
      .leftJoin('files.images', 'associatedImages')
      .where('associatedImages.id IS NULL')
      .orderBy('files.fileIndex.fileName')
      .take(100)
      .skip((page - 1) * 100)

    return await query.getMany()
  }
}

export const taggableManager = new TaggableManager()
