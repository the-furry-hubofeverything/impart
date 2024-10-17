import { Column, Index, Unique } from 'typeorm'

export class FileIndex {
  @Column({ nullable: false, unique: true })
  path: string

  @Column({ nullable: false })
  @Index()
  fileName: string
}
