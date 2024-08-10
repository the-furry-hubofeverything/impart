import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm'
import { Indexable } from './Indexable'
import { Dimensions } from './Dimensions'
import { Thumbnail } from './Thumbnail'

@ChildEntity()
export class IndexedImage extends Indexable {
  @Column()
  pinkynail: string

  @Column(() => Dimensions)
  dimensions: Dimensions

  @OneToOne(() => Thumbnail, { nullable: true, cascade: true })
  @JoinColumn()
  thumbnail?: Thumbnail
}
