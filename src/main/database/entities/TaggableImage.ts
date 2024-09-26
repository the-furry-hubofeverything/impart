import { ChildEntity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { Dimensions } from './Dimensions'
import { Taggable } from './Taggable'
import { FileIndex } from './FileIndex'
import { TaggableFile } from './TaggableFile'
import { Thumbnail } from './Thumbnail'

@ChildEntity()
export class TaggableImage extends Taggable {
  @Column(() => FileIndex)
  fileIndex: FileIndex

  @Column(() => Dimensions)
  dimensions: Dimensions

  @ManyToOne(() => TaggableFile, (t) => t.images, { nullable: true, eager: true })
  source?: TaggableFile

  @OneToOne(() => Thumbnail, { nullable: true, cascade: true })
  @JoinColumn()
  thumbnail?: Thumbnail
}

export function isTaggableImage(t: Taggable): t is TaggableImage {
  return (t as TaggableImage).dimensions != null
}
