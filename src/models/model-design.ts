import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

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
  declare occasion: Occasion;
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
    occasion: DataTypes.ENUM(...OCCASIONS),

    group: DataTypes.ENUM(...GROUPS),
    gender: DataTypes.ENUM(...GENDERS),
    style: DataTypes.ENUM(...STYLES),
  },
  { sequelize, modelName: "Design" },
);

export { Design };
