import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export type OrderStatus = "pending" | "cancelled" | "completed";

export function isOrderStatus(x: any): x is OrderStatus {
  return x === "pending" || x === "cancelled" || x === "completed";
}

class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare design: string;

  declare price: number;
  declare dueDate: Date;
  declare acceptedDate: Date;
  declare status: CreationOptional<OrderStatus>;
}

Order.init(
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
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    dueDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    acceptedDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    status: {
      allowNull: false,
      defaultValue: "pending",
      type: DataTypes.ENUM("pending", "cancelled", "completed"),
    },
  },
  { sequelize, modelName: "Order" },
);

export { Order };
