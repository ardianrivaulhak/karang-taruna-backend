import { DataTypes, Model } from "sequelize";
import Branch from "./Branch";
import Position from "./Position";
import sequelize from "./sequelize";

class BranchHasPosition extends Model {}

BranchHasPosition.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    branch_id: {
      type: DataTypes.UUID,
      references: {
        model: Branch,
      },
    },
    position_id: {
      type: DataTypes.UUID,
      references: {
        model: Position,
      },
    },
  },
  {
    sequelize,
    tableName: "branch_has_positions",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default BranchHasPosition;
