import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
class Setting extends Model {}

Setting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      unique: true,
    },
    value: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    tableName: "settings",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Setting;
