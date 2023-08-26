import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import Post from "./Post";
class Comment extends Model {}

Comment.init(
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
    post_id: {
      type: DataTypes.UUID,
      references: {
        model: Post,
      },
    },
    reply_of_id: {
      type: DataTypes.UUID,
      references: {
        model: Member,
      },
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "comments",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Comment;
