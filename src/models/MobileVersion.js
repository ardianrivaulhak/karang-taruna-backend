import { DataTypes, Model, Op } from "sequelize";
import sequelize from "./sequelize";
class MobileVersion extends Model {}

MobileVersion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "mobile_versions",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default MobileVersion;
