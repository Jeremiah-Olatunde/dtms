import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db-connection.js";

class TailorReview extends Model<
  InferAttributes<TailorReview>,
  InferCreationAttributes<TailorReview>
> {
  declare uid: string;
  declare tailor: string;
  declare client: string;
  declare rating: number;
  declare review: string;
}

TailorReview.init(
  {
    uid: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(21),
    },
    tailor: {
      allowNull: false,
      type: DataTypes.CHAR(21),
    },
    client: {
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
  { sequelize, modelName: "TailorReview" },
);

export { TailorReview };
