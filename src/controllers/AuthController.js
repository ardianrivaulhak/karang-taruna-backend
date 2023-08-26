import moment from "moment";
import configs from "../configs";
import jwt from "jsonwebtoken";
import { randNumber } from "../helpers";
import { Op } from "sequelize";
import Whapi from "../services/Whapi";
import lang from "../lang/lang";
import { Member, Otp, Role, Setting, User, UserHasRole } from "../models";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import MailService from "../services/MailService";

class AuthController {
  #sendOtp(type, value) {
    return new Promise(async (res, rej) => {
      const user = await User.findOne({
        where: {
          [type === "whatsapp" ? "phone_number" : "email"]:
            type === "whatsapp"
              ? {
                  [Op.or]: [value, `${value}`.substring(1)],
                }
              : value,
        },
      });
      try {
        let otp = randNumber(4);
        if (configs.app.env === "development") {
          otp = "1111";
          res(otp);
        }
        await Otp.create({
          user_id: user.get("id"),
          type,
          key: value,
          otp,
          expired_at: moment().add(5, "minutes").format(),
        });
        const defaultMessageTemplate = `{otp} adalah kode OTP Denger-ind Anda. Jangan beritahu siapapun!`;
        const [messageTemplate, messageTemplateCreated] =
          await Setting.findOrCreate({
            where: {
              key: "otpMessage",
            },
            defaults: {
              value: { template: defaultMessageTemplate },
            },
          });
        let parseMessageTemplate = `${
          messageTemplate.get("value").template
        }`.replace("{otp}", otp);
        if (configs.app.env === "development") res(otp);
        if (type === "email") {
          await MailService.sendEmail(user.get("email"), parseMessageTemplate);
        } else {
          Whapi.sendMessage(user.get("phone_number"), parseMessageTemplate);
        }
        res(otp);
      } catch (e) {
        rej(e);
      }
    });
  }

  async register(req, res) {
    try {
      const {
        email,
        phone,
        fcm_token = "",
        nik = "",
        membership_no = randNumber(10),
        name = "",
        gender = "",
        address = "",
        date_of_birth = "",
        job_id = null,
        level_id = null,
        position_id = null,
        village_id = null,
      } = req.body;

      const directory = "storage/" + moment().format("DD-MM-YY") + "/QRCodes/";
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      const pathResolved = path.join(
        directory,
        `${moment().unix()}-${membership_no}-${name}.png`
      );
      QRCode.toFile(pathResolved, membership_no, (err) => {
        if (err) throw Error("Failed generate QRCode!");
      });
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {
              email,
            },
            {
              phone_number: {
                [Op.or]: [phone, `${phone}`.substring(1)],
              },
            },
          ],
        },
      });
      const role = await Role.findOne({
        where: {
          name: "User",
        },
      });
      let userId;
      if (user) {
        userId = user.get("id");
        await user.update({
          phone_number: phone,
          fcm_token,
        });
      } else {
        const createdUser = await User.create({
          email,
          phone_number: phone,
          fcm_token,
        });
        userId = createdUser.get("id");
      }

      await UserHasRole.create({
        user_id: userId,
        role_id: role.get("id"),
      });
      await Member.create({
        user_id: userId,
        nik,
        membership_no,
        name,
        gender,
        address,
        date_of_birth: moment(date_of_birth, "DD-MM-YYYY")
          .startOf("day")
          .toDate(),
        job_id,
        level_id,
        position_id,
        village_id,
        qr_url: pathResolved,
      });
      res.status(200).json({
        message: "Successfully Register",
      });
    } catch (e) {
      console.error("Failed to registering new User =>", e);
      return res
        .status(500)
        .json({ message: "Failed to registering new User" });
    }
  }

  async login(req, res) {
    try {
      const { phone, email } = req.body;

      let type;
      let value;
      const user = await User.findOne({
        where: {
          ...(phone && {
            phone_number: {
              [Op.or]: [phone, `${phone}`.substring(1)],
            },
          }),
          ...(email && { email }),
        },
        include: {
          model: Role,
          attributes: ["id", "name"],
        },
      });
      if (!user) {
        return res.status(404).json({
          message: "user doesn't exist",
        });
      }
      const _user = user.toJSON();
      const foundRoles = _user.Roles.find((el) => el.name === "User");
      if (!foundRoles) {
        return res.status(422).json({
          message: "Account is not registered",
        });
      }

      if (phone) {
        type = "whatsapp";
        value = user.get("phone_number");
      } else {
        type = "email";
        value = user.get("email");
      }

      const otp = await this.#sendOtp(type, value);
      return res.json({
        message: "OTP Code has been sent!",
        ...(configs.app.env !== "production"
          ? {
              otp,
            }
          : {}),
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "System failure",
        e,
      });
    }
  }

  async me(req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.auth.user.id },
        include: {
          model: Member,
        },
      });
      if (!user) {
        return res.status(401).json({ message: "Unauthenticated!" });
      }
      return res.json({
        message: "success",
        data: user,
      });
    } catch (error) {
      console.error("Updating FCM failure =>", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async otpValidation(req, res) {
    try {
      const { email, phone, otp, fcm_token } = req.body;

      const user = await User.findOne({
        where: {
          ...(phone && {
            phone_number: {
              [Op.or]: [phone, `${phone}`.substring(1)],
            },
          }),
          ...(email && { email }),
        },
        include: [
          {
            model: Member,
          },
          {
            model: Role,
          },
        ],
      });

      if (!user) {
        return res.status(401).json({
          message: "User doesn't exists!",
        });
      }

      const _otp = await Otp.scope({
        method: [
          "validOtp",
          user.get("id"),
          phone ? "whatsapp" : "email",
          phone ? phone : email,
          otp,
        ],
      }).findOne();

      if (!_otp) {
        return res.status(401).json({
          message: "OTP Code is not valid!",
        });
      }
      //otp
      jwt.sign({ user }, configs.auth.key, async (err, token) => {
        _otp.destroy();
        user.update({ fcm_token });
        return res.json({
          message: "success",
          data: user,
          token,
        });
      });
    } catch (e) {
      console.error("Validate Otp failure =>", e);
      return res.status(500).json({ message: "System failure!" });
    }
  }

  async updateFcm(req, res) {
    try {
      const { fcm_token } = req.body;
      const user = await User.findOne({
        where: {
          id: req.auth.user.id,
        },
      });

      if (!user.toJSON()) {
        return res.status(401).json({
          message: "User doesn't exists!",
        });
      }

      user.update({ fcm_token });

      return res.json({
        message: "success",
      });
    } catch (e) {
      console.error("Updating FCM failure =>", e);
      return res.status(500).json({ message: "System failure!" });
    }
  }
}

export default new AuthController();
