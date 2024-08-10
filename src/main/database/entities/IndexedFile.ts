import { ChildEntity } from 'typeorm'
import { Indexable } from './Indexable'

@ChildEntity()
export class IndexedFile extends Indexable {}
