import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Taggable } from './Taggable'

@Entity()
export class Directory extends BaseEntity {
  @PrimaryColumn()
  path: string

  @OneToMany(() => Taggable, (t) => t.directory, { onDelete: 'CASCADE' })
  taggables: Taggable[]
}
