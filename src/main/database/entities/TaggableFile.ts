import { ChildEntity, Column, OneToMany } from 'typeorm'
import { Taggable } from './Taggable'
import { FileIndex } from './FileIndex'
import { TaggableImage } from './TaggableImage'

@ChildEntity()
export class TaggableFile extends Taggable {
  @Column(() => FileIndex)
  fileIndex: FileIndex

  @OneToMany(() => TaggableImage, (t) => t.source)
  images: TaggableImage[]
}

export function isTaggableFile(t: Taggable): t is TaggableFile {
  return (t as TaggableImage).dimensions == null
}
