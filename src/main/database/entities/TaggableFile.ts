import { ChildEntity, Column } from 'typeorm'
import { Taggable } from './Taggable'
import { FileIndex } from './FileIndex'
import { TaggableImage } from './TaggableImage'

@ChildEntity()
export class TaggableFile extends Taggable {
  @Column(() => FileIndex)
  fileIndex: FileIndex
}

export function isTaggableFile(t: Taggable): t is TaggableFile {
  return (t as TaggableImage).pinkynail == null
}
