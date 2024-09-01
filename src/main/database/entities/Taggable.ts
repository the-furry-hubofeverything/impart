import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance
} from 'typeorm'
import { Tag } from './Tag'
import { Directory } from './Directory'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Taggable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(() => Tag, (t) => t.images, { eager: true })
  @JoinTable()
  tags: Tag[]

  @ManyToOne(() => Directory, { nullable: false, onDelete: 'CASCADE' })
  directory: Directory
}
