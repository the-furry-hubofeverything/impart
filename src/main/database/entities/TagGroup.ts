import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tag } from './Tag'

@Entity()
export class TagGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { nullable: false })
  label: string

  @OneToMany(() => Tag, (t) => t.group)
  tags: Tag[]
}
