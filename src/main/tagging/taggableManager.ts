import { SelectQueryBuilder } from 'typeorm'
import { Taggable } from '../database/entities/Taggable'

export interface FetchTaggablesOptions {
  tagIds?: number[]
  order?: 'alpha' | 'date'
  search?: string
  year?: number
}

export class TaggableManager {
  public async getTaggables(options?: FetchTaggablesOptions) {
    let query = Taggable.createQueryBuilder('files').setFindOptions({
      loadEagerRelations: true
    })

    if (options) {
      const { tagIds, order, search, year } = options
      if (tagIds && tagIds.length > 0) {
        this.applyTags(query, tagIds)
      }

      if (order) {
        this.applyOrder(query, order)
      }

      if (search && search != '') {
        this.applySearch(query, search)
      }

      if (year) {
        this.applyYear(query, year)
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

  private applyYear(query: SelectQueryBuilder<Taggable>, year: number) {
    query.andWhere("strftime('%Y', files.dateModified) = :year", { year: year.toString() })
  }

  public async getAllTaggableYears() {
    const query = Taggable.createQueryBuilder()
      .select("strftime('%Y', dateModified) AS taggableYear")
      .groupBy('taggableYear')

    const result = await query.getRawMany<{ taggableYear: string }>()

    return result.map((r) => Number(r.taggableYear)).reverse()
  }
}

export const taggableManager = new TaggableManager()
