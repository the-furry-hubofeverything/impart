import { BaseEntity, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Directory extends BaseEntity {
  @PrimaryColumn()
  path: string
}
