import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import District from "./District";

class Village extends Model {}

Village.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    district_id: {
      type: DataTypes.UUID,
      references: {
        model: District,
      },
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "villages",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Village;
