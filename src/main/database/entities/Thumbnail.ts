import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Image } from './Image'

@Entity()
export class Thumbnail extends Image {
  @PrimaryGeneratedColumn()
  id: number
}
