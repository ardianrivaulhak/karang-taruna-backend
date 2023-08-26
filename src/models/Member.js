import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Branch from "./Branch";
import Village from "./Village";
import User from "./User";

class Member extends Model {}

Member.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
      },
    },
    branch_id: {
      type: DataTypes.UUID,
      references: {
        model: Branch,
      },
      allowNull: true,
    },
    village_id: {
      type: DataTypes.UUID,
      references: {
        model: Village,
      },
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    nik: {
      type: DataTypes.STRING,
    },
    membership_no: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["male", "female"],
    },
    address: {
      type: DataTypes.TEXT,
    },
    photo_url: {
      type: DataTypes.STRING,
      defaultValue: "/storage/Group.png",
    },
    date_of_birth: {
      type: DataTypes.DATE,
    },
    job_id: {
      type: DataTypes.UUID,
    },
    level_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    position_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    qr_url: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "members",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Member;
