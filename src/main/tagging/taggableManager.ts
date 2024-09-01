import { Taggable } from '../database/entities/Taggable'

export interface FetchTaggablesOptions {
  tagIds?: number[]
  order?: 'alpha' | 'date'
}

export class TaggableManager {
  public async getTaggables(options?: FetchTaggablesOptions) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (options) {
      const { tagIds, order } = options
      if (tagIds && tagIds.length > 0) {
        Array.from(tagIds).forEach((t, index) => {
          const alias = `tags${index}`
          const variable = `id${index}`
          query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
            [variable]: t
          })
        })
      }

      switch (order) {
        case 'alpha':
          query.orderBy('files.fileIndex.fileName')
          break
        case 'date':
          query.orderBy('files.dateModified', 'DESC')
          break
      }
    }

    query.leftJoin('files.images', 'associatedImages').where('associatedImages.id IS NULL')

    return await query.getMany()
  }
}

export const taggableManager = new TaggableManager()
