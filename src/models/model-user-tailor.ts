import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

export const SOCIALS = ["facebook", "instagram", "linkedin", "twitter"];
type Socials = Partial<Record<(typeof SOCIALS)[number], string>>;

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

  declare socials: null | Socials;
  declare location: null | string;
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

    about: DataTypes.TEXT,
    image: DataTypes.STRING,

    bank: DataTypes.CHAR(255),
    account: DataTypes.CHAR(8),
    location: DataTypes.STRING,

    socials: {
      type: DataTypes.TEXT,
      get(): Socials {
        const raw = this.getDataValue("socials") as string | null;
        return raw ? JSON.parse(raw) : null;
      },
      set(value: Socials) {
        this.setDataValue("socials", JSON.stringify(value) as Socials);
      },
    },
  },
  { sequelize, modelName: "Tailor" },
);

export { Tailor };
