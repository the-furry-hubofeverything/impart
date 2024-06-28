import { app } from "electron";
import { DataSource } from "typeorm";
import { TaggableImage } from "./entities/TaggableImage";
import { Thumbnail } from "./entities/Thumbnail";

const path = app.getPath("appData");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: `${path}/artistry/db.sqlite`,
  entities: [TaggableImage, Thumbnail],
  synchronize: !app.isPackaged,
  logging: app.isPackaged ? false : ["error", "info"],
  logger: "simple-console",
});
