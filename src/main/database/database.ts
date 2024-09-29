import { app } from 'electron'
import { DataSource } from 'typeorm'
import { TaggableImage } from './entities/TaggableImage'
import { Directory } from './entities/Directory'
import { Tag } from './entities/Tag'
import { TagGroup } from './entities/TagGroup'
import { Taggable } from './entities/Taggable'
import { TaggableFile } from './entities/TaggableFile'
import { Thumbnail } from './entities/Thumbnail'
import { TaggableStack } from './entities/TaggableStack'
import { APP_DIR, DEV_DIR } from '../common/appDir'

const path = app.getPath('appData')

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: `${path}/impart/${app.isPackaged ? APP_DIR : DEV_DIR}/db.sqlite`,
  entities: [
    Directory,
    Tag,
    TagGroup,
    Taggable,
    TaggableFile,
    TaggableImage,
    TaggableStack,
    Thumbnail
  ],
  synchronize: true,
  // dropSchema: true,
  logging: app.isPackaged ? false : ['error', 'warn', 'info']
})
