import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Indexable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  path: string

  @Column({ nullable: false })
  fileName: string
}
