import { Column } from 'typeorm'

export class Dimensions {
  @Column({ nullable: false })
  width: number

  @Column({ nullable: false })
  height: number
}
