import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

import { sequelize } from "./db-connection.js";

export const GENDERS = ["male", "female"] as const;
export const MEASUREMENTS = [
  "ankle",
  "armhole",
  "bicep",
  "chest",
  "calf",
  "hips",
  "inseam",
  "knee",
  "neck",
  "outseam",
  "shirt-length",
  "shoulder-width",
  "sleeve-length",
  "thigh",
  "waist",
  "writst",
] as const;

export type Gender = (typeof GENDERS)[number];
export type Measurements = Partial<
  Record<(typeof MEASUREMENTS)[number], number>
>;

class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<Client>
> {
  declare uid: string;
  declare email: string;
  declare phone: string;
  declare lastName: string;
  declare firstName: string;

  declare image?: null | string;
  declare gender?: null | Gender;
  declare address?: null | string;
  declare measurements?: null | Measurements;
}

Client.init(
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

    gender: {
      allowNull: false,
      type: DataTypes.ENUM("male", "female"),
    },

    image: DataTypes.STRING,
    address: DataTypes.STRING,

    measurements: {
      type: DataTypes.TEXT,

      get(): Measurements {
        const raw = this.getDataValue("measurements") as string | null;
        return raw ? JSON.parse(raw) : null;
      },

      set(value: Measurements) {
        this.setDataValue(
          "measurements",
          JSON.stringify(value) as Measurements,
        );
      },
    },
  },
  { sequelize, modelName: "Client" },
);

export { Client };
