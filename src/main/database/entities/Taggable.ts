import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  TableInheritance
} from 'typeorm'
import { Tag } from './Tag'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Taggable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(() => Tag, (t) => t.images, { eager: true })
  @JoinTable()
  tags: Tag[]
}
