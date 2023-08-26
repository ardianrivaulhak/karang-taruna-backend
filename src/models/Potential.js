import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";
// import sequelize from "sequelize";

class Potential extends Model {}

Potential.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "potentials",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Potential;
