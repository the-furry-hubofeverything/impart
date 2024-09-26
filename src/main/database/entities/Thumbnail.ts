import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Dimensions } from './Dimensions'
import { FileIndex } from './FileIndex'

@Entity()
export class Thumbnail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  path: string

  @Column(() => Dimensions)
  dimensions: Dimensions
}
