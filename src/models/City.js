import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Province from "./Province";

class City extends Model {}

City.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    province_id: {
      type: DataTypes.UUID,
      references: {
        model: Province,
      },
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "cities",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default City;
