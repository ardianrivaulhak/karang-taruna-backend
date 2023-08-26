import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";
import Member from "./Member.js";
// import sequelize from "sequelize";

class Survey extends Model {}

Survey.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.UUID,
      references: {
        model: Member,
      },
    },
    potential_explanation: {
      type: DataTypes.STRING,
    },
    expectation: {
      type: DataTypes.STRING,
    },
    issue: {
      type: DataTypes.STRING,
    },
    criticism_and_suggestion: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "surveys",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Survey;
