import { Entity } from 'typeorm'
import { Image } from './Image'

@Entity()
export class Thumbnail extends Image {}
