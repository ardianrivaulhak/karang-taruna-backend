import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
class Post extends Model {}

Post.init(
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
    body: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "posts",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default Post;
