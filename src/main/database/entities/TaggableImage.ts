import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm'
import { Dimensions } from './Dimensions'
import { Thumbnail } from './Thumbnail'
import { Taggable } from './Taggable'
import { IndexedImage } from './IndexedImage'
import { IndexedFile } from './IndexedFile'

@ChildEntity()
export class TaggableImage extends Taggable {
  @OneToOne(() => IndexedImage, { eager: true })
  @JoinColumn()
  image: IndexedImage

  @OneToOne(() => IndexedFile)
  @JoinColumn()
  sourceFile?: IndexedFile
}

export function isTaggableImage(t: Taggable): t is TaggableImage {
  return (t as TaggableImage).image != null
}
