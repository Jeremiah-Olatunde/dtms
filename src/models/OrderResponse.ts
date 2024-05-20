import {
  Model,
  DataTypes,
  type InferAttributes,
  type CreationOptional,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export type OrderResponseState = "pending" | "rejected" | "accepted";

export function isOrderResponseState(x: any): x is OrderResponseState {
  return x === "pending" || x === "rejected" || x === "accepted";
}

class OrderResponse extends Model<
  InferAttributes<OrderResponse>,
  InferCreationAttributes<OrderResponse>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare design: string;
  declare price: number;
  declare completion: Date;
  declare order: CreationOptional<null | string>;
  declare status: CreationOptional<OrderResponseState>;
}

OrderResponse.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    client: {
      allowNull: false,
      type: DataTypes.CHAR(21),
    },
    tailor: {
      allowNull: false,
      type: DataTypes.CHAR(21),
    },
    design: {
      allowNull: false,
      type: DataTypes.CHAR(21),
    },
    order: {
      defaultValue: null,
      type: DataTypes.CHAR(21),
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      defaultValue: null,
      type: DataTypes.ENUM("pending", "rejected", "accepted"),
    },
    completion: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
  },
  { sequelize, modelName: "OrderResponse" },
);

export { OrderResponse };
