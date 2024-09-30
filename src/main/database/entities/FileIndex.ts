import { Column, Index } from 'typeorm'

export class FileIndex {
  @Column({ nullable: false })
  path: string

  @Column({ nullable: false })
  @Index()
  fileName: string
}
