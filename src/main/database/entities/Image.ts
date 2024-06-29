import { BaseEntity, Column } from 'typeorm'

export abstract class Image extends BaseEntity {
  @Column('varchar', { nullable: false })
  path: string

  @Column('int', { nullable: false })
  width: number

  @Column('int', { nullable: false })
  height: number
}
