import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import Post from "./Post";
import Comment from "./Comment";
class Like extends Model {}

Like.init(
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
      allowNull: true,
    },
    comment_id: {
      type: DataTypes.UUID,
      references: {
        model: Comment,
      },
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "likes",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Like;
