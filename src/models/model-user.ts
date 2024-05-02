import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "./db.js";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uid: string;
  declare age: number;
  declare lastName: string;
  declare firstName: string;

  declare email: string;
  declare image: string;
  declare phone: string;
  declare gender: "male" | "female";
}

User.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    age: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    gender: {
      allowNull: false,
      type: DataTypes.ENUM("male", "female"),
    },
  },
  { sequelize, modelName: "User" },
);

export { User };
