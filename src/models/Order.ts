import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

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
  declare status: "pending" | "completed";
  declare timeline: "on track" | "critical" | "overdue";
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
      type: DataTypes.DATEONLY,
    },
    acceptedDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM("pending", "complete"),
    },
    timeline: {
      allowNull: false,
      type: DataTypes.ENUM("on track", "overdue", "critical"),
    },
  },
  { sequelize, modelName: "Order" },
);

export { Order };
