import {
  BeforeInsert,
  BeforeUpdate,
  ChildEntity,
  Column,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm'
import { Taggable } from './Taggable'
import { TaggableImage } from './TaggableImage'

@ChildEntity()
export class TaggableStack extends Taggable {
  @OneToMany(() => Taggable, (t) => t.parent, { cascade: true })
  taggables?: Taggable[]

  @Column({ nullable: true })
  name: string

  @OneToOne(() => TaggableImage, { nullable: true, eager: true })
  @JoinColumn()
  cover: TaggableImage | null

  @BeforeInsert()
  checkDirectory() {
    if (this.directory) {
      throw new Error('Stacks cannot have a directory')
    }
  }
}

export function isTaggableStack(t: Taggable): t is TaggableStack {
  return (t as TaggableStack).name != null
}
