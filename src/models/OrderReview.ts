import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

class OrderReview extends Model<
  InferAttributes<OrderReview>,
  InferCreationAttributes<OrderReview>
> {
  declare uid: string;
  declare order: string;
  declare rating: number;
  declare review: string;
}

OrderReview.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    order: {
      allowNull: false,
      type: DataTypes.CHAR(21),
    },
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    review: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "OrderReview" },
);

export { OrderReview };
