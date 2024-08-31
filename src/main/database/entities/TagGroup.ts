import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tag } from './Tag'

@Entity()
export class TagGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  label?: string

  @Column({ nullable: false })
  groupOrder: number

  @Column({ nullable: true })
  defaultTagColor?: string

  @OneToMany(() => Tag, (t) => t.group, { cascade: true, eager: true, onDelete: 'CASCADE' })
  tags: Tag[]
}
