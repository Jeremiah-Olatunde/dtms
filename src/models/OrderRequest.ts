import {
  Model,
  DataTypes,
  type InferAttributes,
  type CreationOptional,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export type OrderRequestState = "pending" | "rejected" | "accepted";

export function isOrderRequestState(x: any): x is OrderRequestState {
  return x === "pending" || x === "rejected" || x === "accepted";
}

class OrderRequest extends Model<
  InferAttributes<OrderRequest>,
  InferCreationAttributes<OrderRequest>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare design: string;
  declare response: CreationOptional<null | string>;
  declare status: CreationOptional<OrderRequestState>;
}

OrderRequest.init(
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
    response: {
      defaultValue: null,
      type: DataTypes.CHAR(21),
    },
    status: {
      allowNull: false,
      defaultValue: "pending",
      type: DataTypes.ENUM("pending", "rejected", "accepted"),
    },
  },
  { sequelize, modelName: "OrderRequest" },
);

export { OrderRequest };
