import { In, SelectQueryBuilder } from 'typeorm'
import { Taggable } from '../database/entities/Taggable'
import { TaggableStack } from '../database/entities/TaggableStack'
import { isTaggableImage } from '../database/entities/TaggableImage'

export interface FetchTaggablesOptions {
  tagIds?: number[]
  order?: 'alpha' | 'date'
  search?: string
  year?: number
  stackId?: number
  onlyHidden?: boolean
}

export class TaggableManager {
  public async getTaggables(options?: FetchTaggablesOptions) {
    let query = Taggable.createQueryBuilder('files')
      .setFindOptions({
        loadEagerRelations: true
      })
      .loadRelationIdAndMap('files.directory', 'files.directory')

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

    query
      .leftJoin('files.images', 'associatedImages')
      .andWhere('associatedImages.id IS NULL AND files.hide = :hidden', {
        hidden: options?.onlyHidden ? true : false
      })

    if (!options?.stackId) {
      query.andWhere('files.parentId IS NULL')
    } else {
      query.andWhere('files.parentId = :stackId', { stackId: options.stackId })
    }

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
        query.orderBy('COALESCE(files.fileIndex.fileName, files.name) COLLATE NOCASE')
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

  public async createStack(name: string, taggableIds: number[], coverId: number) {
    const childTaggables = await Taggable.find({
      where: { id: In(taggableIds) },
      relations: { directory: true }
    })
    const cover = childTaggables.find((t) => t.id === coverId)

    if (!cover) {
      throw new Error('Cover taggable must be one of the items in the stack')
    }

    const stack = TaggableStack.create({
      name,
      cover: isTaggableImage(cover) ? cover : undefined,
      taggables: childTaggables,
      directory: cover.directory,
      dateModified: cover.dateModified
    })

    await stack.save()
  }

  public async setHidden(ids: number[], hidden: boolean) {
    const taggables = await Taggable.findBy({ id: In(ids) })

    await Promise.all(
      taggables.map(async (t) => {
        t.hide = hidden
        await t.save()
      })
    )
  }
}

export const taggableManager = new TaggableManager()
