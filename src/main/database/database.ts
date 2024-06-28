import { Sequelize } from "sequelize";
import { app } from "electron";

const path = `${app.getPath("appData")}/artistry`;

export const database = new Sequelize({
  dialect: "sqlite",
  storage: `${path}/database.sqlite`,
});
