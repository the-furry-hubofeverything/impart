import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class IndexedDirectory extends BaseEntity {
  @PrimaryColumn("varchar")
  path: string;
}
