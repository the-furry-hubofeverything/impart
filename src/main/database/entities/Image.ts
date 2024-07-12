import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

export abstract class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { nullable: false })
  path: string

  @Column('int', { nullable: false })
  width: number

  @Column('int', { nullable: false })
  height: number
}
