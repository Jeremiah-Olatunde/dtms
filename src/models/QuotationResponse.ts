import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

export type QuotationResponseState = "pending" | "rejected" | "accepted";

export function isQuotationResponseState(x: any): x is QuotationResponseState {
  return x === "pending" || x === "rejected" || x === "accepted";
}

class QuotationResponse extends Model<
  InferAttributes<QuotationResponse>,
  InferCreationAttributes<QuotationResponse>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare design: string;
  declare order: null | string;
  declare status: QuotationResponseState;
  declare price: number;
  declare completion: Date;
}

QuotationResponse.init(
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
  { sequelize, modelName: "QuotationResponse" },
);

export { QuotationResponse };
