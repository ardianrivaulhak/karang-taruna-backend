import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";
// import sequelize from "sequelize";

class Province extends Model {}

Province.init(
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
    tableName: "provinces",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Province;
