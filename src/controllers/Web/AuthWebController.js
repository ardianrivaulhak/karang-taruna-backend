import { Member, Role, User, UserHasRole } from "../../models";
import jwt from "jsonwebtoken";
import configs from "../../configs";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
class AuthWebController {
  async loginWeb(req, res) {
    try {
      const { email, password, fcm_token } = req.body;
      const user = await User.findOne({
        where: {
          email: email,
        },
        include: {
          model: Role,
          through: {
            model: UserHasRole,
            attributes: [],
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "User doesn't exist!",
        });
      }

      const _user = user.toJSON();

      if (
        _user.Roles[0].name !== "Admin" &&
        _user.Roles[0].name !== "Super Admin"
      ) {
        return res.status(401).json({
          message: "Cannot login as Admin or Super Admin!",
        });
      }

      if (_user.status === false) {
        return res.status(401).json({
          message: "User is inactive. Cannot login.",
        });
      }

      const comparePassword = await bcrypt.compare(password, _user.password);

      if (!comparePassword) {
        return res.status(401).json({
          message: "Unauthorized!",
          errors: {
            email: `Credentials don't match with our records!`,
          },
        });
      }
      delete _user.password;
      jwt.sign({ user: _user }, configs.auth.key, async (err, token) => {
        if (err) console.log(err);
        return res.json({
          message: "success",
          data: _user,
          token,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async meWeb(req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.auth.user.id },
      });
      if (!user) {
        return res.status(401).json({ message: "Unauthenticated!" });
      }
      return res.json({
        message: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export default new AuthWebController();
