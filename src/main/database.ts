import { DataTypes, Sequelize } from "sequelize";
import { app } from "electron";

const path = `${app.getPath("appData")}/artistry`;

export const database = new Sequelize({
  dialect: "sqlite",
  storage: `${path}/database.sqlite`,
});

export const IndexedDirectory = database.define("IndexedDirectory", {
  path: {
    type: DataTypes.STRING(1024),
    allowNull: false,
    primaryKey: true,
  },
  recursive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export const TaggableImage = database.define("TaggableImage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const Thumbnail = database.define("Thumbnail", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

IndexedDirectory.hasMany(TaggableImage);

TaggableImage.hasOne(Thumbnail);
TaggableImage.belongsTo(IndexedDirectory);

Thumbnail.belongsTo(TaggableImage);
