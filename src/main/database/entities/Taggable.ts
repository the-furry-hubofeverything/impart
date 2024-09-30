import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  //This should only be pointing to TaggableStacks, but we can't set that because of weird
  // circular dependency issues ("can't load Taggable before it's instantiated" or some such)
  @ManyToOne(() => Taggable, { nullable: true })
  parent?: Taggable

  @Column({ nullable: false })
  @Index()
  dateModified: Date
}
