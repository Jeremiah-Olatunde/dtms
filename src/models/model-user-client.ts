import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "./db.js";

export type Measurements = Partial<
  Record<
    | "ankle"
    | "armhole"
    | "bicep"
    | "chest"
    | "calf"
    | "hips"
    | "inseam"
    | "knee"
    | "neck"
    | "outseam"
    | "shirt-length"
    | "shoulder-width"
    | "sleeve-length"
    | "thigh"
    | "waist"
    | "writst",
    number
  >
>;

export type Gender = "male" | "female";

class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<Client>
> {
  declare uid: string;
  declare email: string;
  declare phone: string;
  declare lastName: string;
  declare firstName: string;

  declare image: null | string;
  declare gender: null | Gender;
  declare location: null | string;
  declare measurements: null | Measurements;
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
      validate: { isEmail: true },
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    gender: DataTypes.ENUM("male", "female"),
    image: DataTypes.STRING,
    location: DataTypes.STRING,

    measurements: {
      type: DataTypes.STRING,

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
