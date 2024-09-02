import { SelectQueryBuilder } from 'typeorm'
import { Taggable } from '../database/entities/Taggable'

export interface FetchTaggablesOptions {
  tagIds?: number[]
  order?: 'alpha' | 'date'
  search?: string
}

export class TaggableManager {
  public async getTaggables(options?: FetchTaggablesOptions) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (options) {
      const { tagIds, order, search } = options
      if (tagIds && tagIds.length > 0) {
        this.applyTags(query, tagIds)
      }

      if (order) {
        this.applyOrder(query, order)
      }

      if (search && search != '') {
        this.applySearch(query, search)
      }
    }

    query.leftJoin('files.images', 'associatedImages').andWhere('associatedImages.id IS NULL')

    return await query.getMany()
  }

  private applyTags(query: SelectQueryBuilder<Taggable>, tagIds: number[]) {
    Array.from(tagIds).forEach((t, index) => {
      const alias = `tags${index}`
      const variable = `id${index}`
      query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
        [variable]: t
      })
    })
  }

  private applyOrder(query: SelectQueryBuilder<Taggable>, order: 'alpha' | 'date') {
    switch (order) {
      case 'alpha':
        query.orderBy('files.fileIndex.fileName')
        break
      case 'date':
        query.orderBy('files.dateModified', 'DESC')
        break
    }
  }

  private applySearch(query: SelectQueryBuilder<Taggable>, search: string) {
    const terms = search.split(' ')

    terms.forEach((t, index) => {
      query.andWhere(`files.fileIndex.fileName LIKE :term${index}`, { [`term${index}`]: `%${t}%` })
    })
  }
}

export const taggableManager = new TaggableManager()
