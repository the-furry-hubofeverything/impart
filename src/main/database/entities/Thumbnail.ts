import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Dimensions } from './Dimensions'

@Entity()
export class Thumbnail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  path: string

  @Column({ nullable: false })
  fileName: string

  @Column(() => Dimensions)
  dimensions: Dimensions
}
