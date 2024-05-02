import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

export const OCCASSIONS = ["casual", "business", "formal"] as const;

export const TYPES = [
  "blouse",
  "coat",
  "dress",
  "jacket",
  "jumpsuit",
  "shirt",
  "shorts",
  "skirt",
  "suit",
  "swimwear",
  "trousers",
  "two-peice",
] as const;

export type Type = (typeof TYPES)[number];
export type Occasion = (typeof OCCASSIONS)[number];

export type Group = "adults" | "kids";
export type Gender = "male" | "female";
export type Style = "english" | "traditional";

class Design extends Model<
  InferAttributes<Design>,
  InferCreationAttributes<Design>
> {
  declare uid: string;
  declare tailor: string;

  declare image: string;
  declare price: number;
  declare ranking: number;
  declare description: string;

  declare type: Type;
  declare style: Style;
  declare group: Group;
  declare gender: Gender;
  declare occassion: Occasion;
}

Design.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    tailor: {
      allowNull: false,
      type: DataTypes.CHAR(21),
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    ranking: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    type: DataTypes.ENUM(...TYPES),
    occassion: DataTypes.ENUM(...OCCASSIONS),

    group: DataTypes.ENUM("adults", "kids"),
    gender: DataTypes.ENUM("male", "female"),
    style: DataTypes.ENUM("english", "traditional"),
  },
  { sequelize, modelName: "Design" },
);

export { Design };
