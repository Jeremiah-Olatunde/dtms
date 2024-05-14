import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

class OrderDesign extends Model<
  InferAttributes<OrderDesign>,
  InferCreationAttributes<OrderDesign>
> {
  declare uid: string;
  declare image: string;
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
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "OrderDesign" },
);

export { OrderDesign };
