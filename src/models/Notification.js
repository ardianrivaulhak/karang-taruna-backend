import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import News from "./News";
import Event from "./Event";
class Notification extends Model {}

Notification.init(
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
    news_id: {
      type: DataTypes.UUID,
      references: {
        model: News,
      },
    },
    event_id: {
      type: DataTypes.UUID,
      references: {
        model: Event,
      },
    },
    label: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["waiting", "approved", "rejected"],
    },
    type: {
      type: DataTypes.ENUM,
      values: ["news", "event"],
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Notification;
