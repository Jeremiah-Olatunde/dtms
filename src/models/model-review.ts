import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "./db.js";

class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare uid: string;
  declare text: string;
  declare rating: number;
  declare tailor: string;
  declare client: string;
}

Review.init(
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
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        min: 0,
        max: 10,
      },
    },
    text: DataTypes.TEXT,
  },
  { sequelize, modelName: "Review" },
);

export { Review };
