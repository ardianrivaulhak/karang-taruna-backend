import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";

class UserHasRole extends Model {}

UserHasRole.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    role_id: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    tableName: "user_has_roles",
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
  }
);

export default UserHasRole;
