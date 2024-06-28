import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class TaggableImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { nullable: false })
  path: string;

  @Column("int", { nullable: false })
  width: number;

  @Column("int", { nullable: false })
  height: number;
}
