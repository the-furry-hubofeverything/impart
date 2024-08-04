import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm'
import { Image } from './Image'
import { Thumbnail } from './Thumbnail'
import { Tag } from './Tag'

@Entity()
export class TaggableImage extends Image {
  @Column()
  pinkynail: string

  @OneToOne(() => Thumbnail, { nullable: true, cascade: true })
  @JoinColumn()
  thumbnail?: Thumbnail

  @ManyToMany(() => Tag, (t) => t.images, { eager: true })
  @JoinTable()
  tags: Tag[]
}
