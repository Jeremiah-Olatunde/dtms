import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

class Credentials extends Model<
  InferAttributes<Credentials>,
  InferCreationAttributes<Credentials>
> {
  declare uid: string;
  declare email: string;
  declare password: string;
  declare usertype: "client" | "tailor";
}

Credentials.init(
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
    password: {
      allowNull: false,
      type: DataTypes.CHAR(60),
    },
    usertype: {
      allowNull: false,
      type: DataTypes.ENUM("client", "tailor"),
    },
  },
  { sequelize, modelName: "Credentials" },
);

export { Credentials };
