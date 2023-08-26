import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Branch from "./Branch";
import Member from "./Member";

class BranchRating extends Model {}

BranchRating.init(
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
    member_id: {
      type: DataTypes.UUID,
      references: {
        model: Member,
      },
    },
    rating: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "branch_ratings",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default BranchRating;
