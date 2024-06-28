import { DataTypes } from "sequelize";
import { database } from "../database";

export const TaggableImage = database.define("TaggableImage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
