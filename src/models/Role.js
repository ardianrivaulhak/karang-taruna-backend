import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "roles",
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
  }
);

export default Role;
