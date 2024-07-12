import { BaseEntity, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class IndexedDirectory extends BaseEntity {
  @PrimaryColumn()
  path: string
}
