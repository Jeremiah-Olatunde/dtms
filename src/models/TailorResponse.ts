import {
  Model,
  DataTypes,
  type InferAttributes,
  type CreationOptional,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export type TailorResponseStatus = "pending" | "rejected" | "accepted";

export function isTailorResponseStatus(x: any): x is TailorResponseStatus {
  return x === "pending" || x === "rejected" || x === "accepted";
}

class TailorResponse extends Model<
  InferAttributes<TailorResponse>,
  InferCreationAttributes<TailorResponse>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare design: string;

  declare proposedPrice: number;
  declare proposedCompletionDate: Date;
  declare order: CreationOptional<null | string>;
  declare status: CreationOptional<TailorResponseStatus>;
}

TailorResponse.init(
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
    status: {
      defaultValue: "pending",
      type: DataTypes.ENUM("pending", "rejected", "accepted"),
    },
    proposedPrice: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    proposedCompletionDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "TailorResponse" },
);

export { TailorResponse };
