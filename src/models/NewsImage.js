import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";
import News from "./News";

class NewsImage extends Model {}

NewsImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    news_id: {
      type: DataTypes.UUID,
      references: {
        model: News,
      },
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "news_images",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

export default NewsImage;
