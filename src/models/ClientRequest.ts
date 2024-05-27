import {
  Model,
  DataTypes,
  type InferAttributes,
  type CreationOptional,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

export type ClientRequestStatus = "pending" | "rejected" | "accepted";

export function isClientRequestStatus(x: any): x is ClientRequestStatus {
  return x === "pending" || x === "rejected" || x === "accepted";
}

class ClientRequest extends Model<
  InferAttributes<ClientRequest>,
  InferCreationAttributes<ClientRequest>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare design: string;
  declare response: CreationOptional<null | string>;
  declare status: CreationOptional<ClientRequestStatus>;
}

ClientRequest.init(
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
  { sequelize, modelName: "ClientRequest" },
);

export { ClientRequest };
