import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Image } from './Image'
import { Thumbnail } from './Thumbnail'
import { Tag } from './Tag'

@Entity()
export class TaggableImage extends Image {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Thumbnail, { nullable: true, eager: true, cascade: true })
  @JoinColumn()
  thumbnail?: Thumbnail

  @ManyToMany(() => Tag, (t) => t.images)
  @JoinTable()
  tags: Tag[]
}
