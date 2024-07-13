import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

export abstract class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  path: string

  @Column({ nullable: false })
  fileName: string

  @Column({ nullable: false })
  width: number

  @Column({ nullable: false })
  height: number
}
