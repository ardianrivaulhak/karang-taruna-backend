import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Survey from "./Survey";
import Potential from "./Potential";

class SurverPotential extends Model {}

SurverPotential.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    survey_id: {
      type: DataTypes.UUID,
      references: {
        model: Survey,
      },
    },
    potential_id: {
      type: DataTypes.UUID,
      references: {
        model: Potential,
      },
    },
  },
  {
    sequelize,
    tableName: "survey_potentials",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default SurverPotential;
