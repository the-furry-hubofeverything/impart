import { app } from 'electron'
import { DataSource } from 'typeorm'
import { TaggableImage } from './entities/TaggableImage'
import { Thumbnail } from './entities/Thumbnail'
import { Directory } from './entities/Directory'
import { Tag } from './entities/Tag'
import { TagGroup } from './entities/TagGroup'
import { Taggable } from './entities/Taggable'
import { TaggableFile } from './entities/TaggableFile'
import { Indexable } from './entities/Indexable'
import { IndexedImage } from './entities/IndexedImage'
import { IndexedFile } from './entities/IndexedFile'

const path = app.getPath('appData')

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: app.isPackaged ? `${path}/impart/app/db.sqlite` : `${path}/impart/dev/db.sqlite`,
  entities: [
    Thumbnail,
    Directory,
    Tag,
    TagGroup,
    Taggable,
    TaggableFile,
    TaggableImage,
    Indexable,
    IndexedImage,
    IndexedFile
  ],
  synchronize: true,
  // dropSchema: true,
  logging: app.isPackaged ? false : ['error', 'warn', 'info']
})
