import rateLimit from "express-rate-limit";
import { Op } from "sequelize";
import configs from "../configs";
import RateLimiter from "../middlewares/RateLimiter";
import Validator from "../middlewares/Validator";
import { Member, Role, User } from "../models";

class AuthValidation extends Validator {
  loginByPhone(req, res, next) {
    return [
      configs.app.env == "production"
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) =>
              res.json({ message: "Too many attempt!" }),
          })
        : (req, res, next) => next(),
      this.body("phone")
        .isNumeric()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              phone: {
                [Op.like]: `%${field}`,
              },
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        })
        .isLength({ min: 9, max: 13 })
        .customSanitizer((item) => {
          if (`${item}`.substring(0, 1) !== "0") return `0${item}`;
          return `${item}`;
        }),
      this.throwIfError,
    ];
  }
  loginByGoogle(req, res, next) {
    return [
      configs.app.env == "production"
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) =>
              res.json({ message: "Too many attempt!" }),
          })
        : (req, res, next) => next(),
      this.body("uid").notEmpty(),
      this.body("fcm_token").notEmpty(),
      this.throwIfError,
    ];
  }
  registerByGoogle(req, res, next) {
    return [
      configs.app.env == "production"
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) =>
              res.json({ message: "Too many attempt!" }),
          })
        : (req, res, next) => next(),
      this.body("uid").notEmpty(),
      this.body("fcm_token").notEmpty(),
      this.throwIfError,
    ];
  }
  otpValidation(req, res, next) {
    return [
      configs.app.env == "production"
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) =>
              res.json({ message: "Too many attempt!" }),
          })
        : (req, res, next) => next(),
      this.body("phone")
        .isNumeric()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              phone: {
                [Op.like]: `%${field}`,
              },
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        })
        .isLength({ min: 9, max: 13 })
        .customSanitizer((item) => {
          if (`${item}`.substring(0, 1) !== "0") return `0${item}`;
          return `${item}`;
        }),
      this.throwIfError,
    ];
  }
  usernameOrEmail(req, res, next) {
    return [
      configs.app.env == "production"
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) =>
              res.json({ message: "Too many attempt!" }),
          })
        : (req, res, next) => next(),
      this.body("email").custom(async (field = null) => {
        if (field) {
          const user = await User.findOne({
            where: {
              email: field,
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        }
      }),
      this.body("username").custom(async (field = null) => {
        if (field) {
          const user = await User.findOne({
            where: {
              username: field,
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        }
      }),
      this.throwIfError,
    ];
  }
  register(req, res, next) {
    return [
      configs.app.env == "production"
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) =>
              res.json({ message: "Too many attempt!" }),
          })
        : (req, res, next) => next(),
      this.body("email")
        .isEmail()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              email: field,
            },
            include: {
              model: Role,
            },
          });
          if (user && user.Roles.find((el) => el.name === "User")) {
            return Promise.reject("Email has been registered!");
          }
        }),
      this.body("phone")
        .isNumeric()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              phone_number: {
                [Op.or]: [field, `${field}`.substring(1)],
              },
            },
            include: {
              model: Role,
            },
          });
          if (user && user.Roles.find((el) => el.name === "User")) {
            return Promise.reject("Phone number has been registered!");
          }
        })
        .isLength({ min: 9, max: 13 })
        .customSanitizer((item) => {
          if (`${item}`.substring(0, 1) !== "0") return `0${item}`;
          return `${item}`;
        }),
      this.throwIfError,
    ];
  }
  checkEmail() {
    return [
      configs.app.env == "production"
        ? RateLimiter.handle()
        : (req, res, next) => next(),
      this.body("email")
        .isEmail()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              email: field,
            },
          });
          console.log(`Checking Email is exists => `, user?.toJSON());
          if (user) {
            return Promise.reject("email has been registered!");
          }
        }),
      this.throwIfError,
    ];
  }
  checkUsername() {
    return [
      configs.app.env == "production"
        ? RateLimiter.handle()
        : (req, res, next) => next(),
      this.body("username")
        .isString()
        .notEmpty()
        .custom(async (field) => {
          const user = await Member.findOne({
            where: {
              username: field,
            },
          });
          if (user) {
            return Promise.reject("username has been registered!");
          }
        }),
      this.throwIfError,
    ];
  }
}

export default new AuthValidation();
