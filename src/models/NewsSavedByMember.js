import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import News from "./News";

class NewsSavedByMember extends Model {}

NewsSavedByMember.init(
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
  },
  {
    sequelize,
    tableName: "news_saved_by_users",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default NewsSavedByMember;
