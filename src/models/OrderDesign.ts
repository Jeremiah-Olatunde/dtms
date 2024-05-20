import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

class OrderDesign extends Model<
  InferAttributes<OrderDesign>,
  InferCreationAttributes<OrderDesign>
> {
  declare uid: string;
  declare image: string;
  declare title: string;
  declare description: string;
}

OrderDesign.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "OrderDesign" },
);

export { OrderDesign };
