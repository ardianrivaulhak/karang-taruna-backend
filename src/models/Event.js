import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import Approval from "./Approval";

class Event extends Model {}

Event.init(
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
    approval_id: {
      type: DataTypes.UUID,
      references: {
        model: Approval,
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["waiting", "approved", "rejected"],
    },
    title: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    start_time: {
      type: DataTypes.STRING,
    },
    end_time: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.TEXT,
    },
    sponsor_name: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.TEXT,
    },
    poster_url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "events",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Event;
