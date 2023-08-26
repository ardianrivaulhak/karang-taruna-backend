import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import Post from "./Post";
import moment from "moment";
class CommunityNotification extends Model {}

CommunityNotification.init(
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
    reactor_id: {
      type: DataTypes.UUID,
      references: {
        model: Member,
      },
    },
    post_id: {
      type: DataTypes.UUID,
      references: {
        model: Post,
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: ["like", "comment", "mention"],
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: moment().toDate(),
    },
  },
  {
    sequelize,
    tableName: "community_notifications",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default CommunityNotification;
