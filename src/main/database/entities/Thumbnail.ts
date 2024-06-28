import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Image } from "./Image";

@Entity()
export class Thumbnail extends Image {
  @PrimaryGeneratedColumn()
  id: number;
}
