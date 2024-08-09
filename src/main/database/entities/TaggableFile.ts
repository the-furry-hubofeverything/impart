import { ChildEntity, Column } from 'typeorm'
import { Taggable } from './Taggable'

@ChildEntity()
export class TaggableFile extends Taggable {
  @Column({ nullable: false })
  path: string

  @Column({ nullable: false })
  fileName: string
}

export function isTaggableFile(t: Taggable): t is TaggableFile {
  return (t as TaggableFile).path != null
}
