import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import User from "./User";

class Approval extends Model {}

Approval.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
      },
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    declined_id: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    tableName: "approvals",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Approval;
