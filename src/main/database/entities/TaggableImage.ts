import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm'
import { Dimensions } from './Dimensions'
import { Taggable } from './Taggable'
import { FileIndex } from './FileIndex'

@ChildEntity()
export class TaggableImage extends Taggable {
  @Column(() => FileIndex)
  fileIndex: FileIndex

  @Column(() => Dimensions)
  dimensions: Dimensions
}

export function isTaggableImage(t: Taggable): t is TaggableImage {
  return (t as TaggableImage).dimensions != null
}
