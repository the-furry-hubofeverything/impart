import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm'
import { Dimensions } from './Dimensions'
import { Thumbnail } from './Thumbnail'
import { Taggable } from './Taggable'
import { FileIndex } from './FileIndex'

@ChildEntity()
export class TaggableImage extends Taggable {
  @Column()
  pinkynail: string

  @Column(() => FileIndex)
  fileIndex: FileIndex

  @Column(() => Dimensions)
  dimensions: Dimensions

  @OneToOne(() => Thumbnail, { nullable: true, cascade: true })
  @JoinColumn()
  thumbnail?: Thumbnail
}

export function isTaggableImage(t: Taggable): t is TaggableImage {
  return (t as TaggableImage).pinkynail != null
}
