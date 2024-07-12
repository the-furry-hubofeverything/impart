import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tag } from './Tag'

@Entity()
export class TagGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  label?: string

  @Column('int')
  order?: number

  @OneToMany(() => Tag, (t) => t.group, { cascade: true, eager: true })
  tags: Tag[]
}
