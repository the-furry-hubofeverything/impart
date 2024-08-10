import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm'
import { Taggable } from './Taggable'
import { IndexedFile } from './IndexedFile'

@ChildEntity()
export class TaggableFile extends Taggable {
  @OneToOne(() => IndexedFile, { eager: true })
  @JoinColumn()
  file: IndexedFile
}

export function isTaggableFile(t: Taggable): t is TaggableFile {
  return (t as TaggableFile).file != null
}
