import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Image } from './Image'

@Entity()
export class Thumbnail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column(() => Image)
  image: Image
}
