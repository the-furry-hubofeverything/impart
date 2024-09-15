import { ChildEntity, Column, OneToMany, OneToOne } from 'typeorm'
import { Taggable } from './Taggable'

@ChildEntity()
export class TaggableStack extends Taggable {
  @OneToMany(() => Taggable, (t) => t.parent, { cascade: true })
  taggables: Taggable[]

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  coverPath?: string
}

export function isTaggableStack(t: Taggable): t is TaggableStack {
  return (t as TaggableStack).name != null
}
