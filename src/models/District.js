import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import City from "./City";

class District extends Model {}

District.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    city_id: {
      type: DataTypes.UUID,
      references: {
        model: City,
      },
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "districts",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default District;
