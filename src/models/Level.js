import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";
// import sequelize from "sequelize";

class Level extends Model {}

Level.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "levels",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Level;
