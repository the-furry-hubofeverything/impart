import { BaseEntity, Column, PrimaryColumn } from "typeorm";

export class IndexedDirectory extends BaseEntity {
  @PrimaryColumn("varchar")
  path: string;
}
