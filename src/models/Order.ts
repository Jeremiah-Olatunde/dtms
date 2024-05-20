import {
  Model,
  DataTypes,
  type InferAttributes,
  type CreationOptional,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

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
  declare status: CreationOptional<"pending" | "cancelled" | "completed">;
  declare timeline: CreationOptional<"on track" | "overdue" | "critical">;
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
      defaultValue: "pending",
      type: DataTypes.ENUM("pending", "cancelled", "completed"),
    },
    timeline: {
      type: DataTypes.VIRTUAL, // DataTypes.ENUM("on track", "critical", "overdue"),
      get() {
        const due = this.getDataValue("dueDate").getTime();
        const delta = (due - Date.now()) / (1000 * 60 * 60 * 24);

        if (delta < 0) return "overdue";
        if (delta < 14) return "critical";
        return "on track";
      },
    },
  },
  { sequelize, modelName: "Order" },
);

export { Order };
