import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export const SOCIALS = [
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
] as const;

export type Socials = Record<(typeof SOCIALS)[number], string | null>;

export function isSocials(x: any): x is Socials {
  return SOCIALS.includes(x);
}

class Tailor extends Model<
  InferAttributes<Tailor>,
  InferCreationAttributes<Tailor>
> {
  declare uid: string;
  declare email: string;
  declare phone: string;
  declare lastName: string;
  declare firstName: string;

  declare about: null | string;
  declare image: null | string;

  declare bank: null | string;
  declare account: null | string;

  declare address: null | string;
  declare socials: null | Socials;
}

Tailor.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING(11),
    },

    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    about: DataTypes.TEXT,
    image: DataTypes.STRING,

    bank: DataTypes.CHAR(255),
    account: DataTypes.CHAR(8),
    address: DataTypes.STRING,

    socials: {
      type: DataTypes.TEXT,
      get(): Socials {
        const raw = this.getDataValue("socials") as string | null;
        return raw ? JSON.parse(raw) : null;
      },
      set(value: Socials) {
        this.setDataValue(
          "socials",
          JSON.stringify(value) as unknown as Socials,
        );
      },
    },
  },
  { sequelize, modelName: "Tailor" },
);

export { Tailor };