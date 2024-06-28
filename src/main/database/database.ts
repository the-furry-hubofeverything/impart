import { app } from "electron";
import { DataSource } from "typeorm";
import { TaggableImage } from "./entities/TaggableImage";

const path = app.getPath("appData");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: `${path}/artistry/db.sqlite`,
  entities: [TaggableImage],
  synchronize: !app.isPackaged,
  logging: app.isPackaged ? false : "all",
  logger: "simple-console",
});
