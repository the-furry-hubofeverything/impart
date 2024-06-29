import { app } from "electron";
import { DataSource } from "typeorm";
import { TaggableImage } from "./entities/TaggableImage";
import { Thumbnail } from "./entities/Thumbnail";
import { IndexedDirectory } from "./entities/IndexedDirectory";

const path = app.getPath("appData");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: app.isPackaged
    ? `${path}/impart/app/db.sqlite`
    : `${path}/impart/dev/db.sqlite`,
  entities: [TaggableImage, Thumbnail, IndexedDirectory],
  synchronize: !app.isPackaged,
  dropSchema: true,
  logging: app.isPackaged ? false : ["error", "info"],
  logger: "simple-console",
});
