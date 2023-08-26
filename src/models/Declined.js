import { DataTypes, Model } from "sequelize";
import Event from "./Event";
import News from "./News";
import sequelize from "./sequelize";

class Declined extends Model {}

Declined.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["news", "event"],
    },
    reason: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "declined",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Declined;
