import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm'

export class FileIndex {
  @Column({ nullable: false })
  path: string

  @Column({ nullable: false })
  fileName: string
}
