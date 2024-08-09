import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm'
import { Image } from './Image'
import { Thumbnail } from './Thumbnail'
import { Taggable } from './Taggable'

@ChildEntity()
export class TaggableImage extends Taggable {
  @Column()
  pinkynail: string

  @Column(() => Image)
  image: Image

  @OneToOne(() => Thumbnail, { nullable: true, cascade: true })
  @JoinColumn()
  thumbnail?: Thumbnail
}
