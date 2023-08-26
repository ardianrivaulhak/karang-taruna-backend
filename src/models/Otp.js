import { DataTypes, Model, Op } from "sequelize";
import moment from "moment";
import sequelize from "./sequelize";
import User from "./User";
class Otp extends Model {}

Otp.init(
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
    type: {
      type: DataTypes.ENUM,
      values: ["email", "whatsapp"],
    },
    key: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    expired_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "otps",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: "deleted_at",
    paranoid: true,
    scopes: {
      validOtp(user_id, type, key, otp) {
        return {
          where: {
            user_id,
            type,
            key,
            otp,
            expired_at: {
              [Op.gt]: moment().format(),
            },
          },
        };
      },
    },
  }
);

export default Otp;
