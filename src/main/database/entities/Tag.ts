import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TagGroup } from './TagGroup'
import { TaggableImage } from './TaggableImage'

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  label: string

  @Column({ nullable: false })
  color: string

  @ManyToOne(() => TagGroup, (g) => g.tags)
  group: TagGroup

  @ManyToMany(() => TaggableImage, (i) => i.tags)
  images: TaggableImage[]
}
