import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./Image";
import { Thumbnail } from "./Thumbnail";

@Entity()
export class TaggableImage extends Image {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Thumbnail, { nullable: true, eager: true })
  @JoinColumn()
  thumbnail?: Thumbnail;
}
