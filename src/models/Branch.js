import { DataTypes, Model } from "sequelize";
import Level from "./Level";
import sequelize from "./sequelize";
import Village from "./Village";

class Branch extends Model {}

Branch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    village_id: {
      type: DataTypes.UUID,
      references: {
        model: Village,
      },
    },
    name: {
      type: DataTypes.STRING,
    },
    current_point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level_id: {
      type: DataTypes.UUID,
      references: {
        model: Level,
      },
    },
    last_updated_rank: {
      type: DataTypes.INTEGER,
    },
    last_updated_date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "branchs",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Branch;
