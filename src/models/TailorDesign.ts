import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export const GROUPS = ["adults", "kids"] as const;
export const GENDERS = ["male", "female"] as const;
export const STYLES = ["english", "traditional"] as const;
export const OCCASIONS = ["casual", "business", "formal", "uniform"] as const;
export const TYPES = [
  "dress",
  "jacket",
  "shirt",
  "shorts",
  "skirt",
  "suit",
  "trousers",
] as const;

export type Type = (typeof TYPES)[number];
export type Style = (typeof STYLES)[number];
export type Group = (typeof GROUPS)[number];
export type Gender = (typeof GENDERS)[number];
export type Occasion = (typeof OCCASIONS)[number];

export const isType = (x: any): x is Type => TYPES.includes(x);
export const isStyle = (x: any): x is Style => STYLES.includes(x);
export const isGroup = (x: any): x is Group => GROUPS.includes(x);
export const isGender = (x: any): x is Gender => GENDERS.includes(x);
export const isOccasion = (x: any): x is Occasion => OCCASIONS.includes(x);

class TailorDesign extends Model<
  InferAttributes<TailorDesign>,
  InferCreationAttributes<TailorDesign>
> {
  declare uid: string;
  declare tailor: string;

  declare price: number;
  declare ranking: number;

  declare image: string;
  declare title: string;
  declare description: string;

  declare type: null | Type;
  declare style: null | Style;
  declare group: null | Group;
  declare gender: null | Gender;
  declare occasion: null | Occasion;
}

TailorDesign.init(
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
    image: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    ranking: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },

    type: DataTypes.ENUM(...TYPES),
    style: DataTypes.ENUM(...STYLES),
    group: DataTypes.ENUM(...GROUPS),
    gender: DataTypes.ENUM(...GENDERS),
    occasion: DataTypes.ENUM(...OCCASIONS),
  },
  { sequelize, modelName: "TailorDesign" },
);

export { TailorDesign };
