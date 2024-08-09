import { app } from 'electron'
import { DataSource } from 'typeorm'
import { TaggableImage } from './entities/TaggableImage'
import { Thumbnail } from './entities/Thumbnail'
import { IndexedDirectory } from './entities/IndexedDirectory'
import { Tag } from './entities/Tag'
import { TagGroup } from './entities/TagGroup'
import { Taggable } from './entities/Taggable'
import { TaggableFile } from './entities/TaggableFile'

const path = app.getPath('appData')

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: app.isPackaged ? `${path}/impart/app/db.sqlite` : `${path}/impart/dev/db.sqlite`,
  entities: [TaggableImage, Thumbnail, IndexedDirectory, Tag, TagGroup, Taggable, TaggableFile],
  synchronize: true,
  dropSchema: true,
  logging: app.isPackaged ? false : ['error', 'warn', 'info']
})
