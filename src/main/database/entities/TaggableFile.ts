import { BeforeInsert, BeforeUpdate, ChildEntity, Column, OneToMany } from 'typeorm'
import { Taggable } from './Taggable'
import { FileIndex } from './FileIndex'
import { TaggableImage, isTaggableImage } from './TaggableImage'

@ChildEntity()
export class TaggableFile extends Taggable {
  @Column(() => FileIndex)
  fileIndex: FileIndex

  @OneToMany(() => TaggableImage, (t) => t.source)
  images?: TaggableImage[]

  @BeforeInsert()
  checkDirectory() {
    if (!this.directory) {
      throw new Error('Files require a directory')
    }
  }
}

export function isTaggableFile(t: Taggable): t is TaggableFile {
  return !isTaggableImage(t) && (t as TaggableFile).fileIndex != null
}
