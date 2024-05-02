import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

export type UserType = "client" | "tailor";

class Login extends Model<
  InferAttributes<Login>,
  InferCreationAttributes<Login>
> {
  declare uid: string;
  declare email: string;
  declare hashed: string;
  declare usertype: UserType;
}

Login.init(
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
    hashed: {
      allowNull: false,
      type: DataTypes.CHAR(60),
    },
    usertype: {
      allowNull: false,
      type: DataTypes.ENUM("client", "tailor"),
    },
  },
  { sequelize, modelName: "Login" },
);

export { Login };
