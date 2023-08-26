import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import Member from "./Member";
import Approval from "./Approval";
import Category from "./Category";

class News extends Model {}

News.init(
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
    category_id: {
      type: DataTypes.UUID,
      references: { model: Category },
    },

    editor_name: {
      type: DataTypes.STRING,
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
    time: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "news",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default News;
