import { Op } from "sequelize";
import { User } from "../../models";
import Role from "../../models/Role";
import sequelize from "../../models/sequelize";
import UserHasRole from "../../models/userHasRole";
import bcrypt from "bcrypt";
import moment from "moment";
class UserWebController {
  async getUser(req, res) {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { rows: users, count } = await User.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        include: [
          {
            model: Role,
            attributes: ["name"],
          },
        ],
        offset: offset,
        limit: limit,
      });

      if (count === 0) {
        return res.status(404).json({
          message: "No user found",
        });
      }

      const totalPage = Math.ceil(count / limit);
      const prevPage = page === 1 ? null : page - 1;
      const nextPage = page === totalPage ? null : page + 1;

      const _users = users.map((el) => {
        const _el = el.toJSON();
        return {
          id: _el.id,
          name: _el.name,
          email: _el.email,
          role: _el?.Roles[0]?.name || null,
          status: _el?.status || null,
        };
      });

      res.status(200).json({
        message: "Success",
        data: _users,
        page: page,
        limit: limit,
        totalRows: count,
        totalPage: totalPage,
        nextPage: nextPage,
        prevPage: prevPage,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while fetching user data" });
    }
  }

  async detailUser(req, res) {
    try {
      const { user_id } = req.params;

      const user = await User.findByPk(user_id, {
        include: Role,
      });
      if (!user) {
        return res.status(404).json({
          message: "User not found!",
        });
      }
      console.log(user.Roles[0].name);
      const _users = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Roles[0].name || null,
      };
      res.status(200).json({
        message: "Success",
        data: _users,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while fetching user data" });
    }
  }

  async createUser(req, res) {
    const t = await sequelize.transaction();
    try {
      const { email, name, password, role_id } = req.body;

      const user = await User.create(
        {
          name: name,
          email: email,
          password: bcrypt.hashSync(password, 10),
        },

        { transaction: t }
      );

      await UserHasRole.create(
        {
          user_id: user.id,
          role_id: role_id,
        },
        { transaction: t }
      );

      await t.commit();

      return res.json({
        message: "User Created",
        statusCode: 201,
      });
    } catch (e) {
      await t.rollback();
      console.error("Failed to create new User =>", e);
      return res
        .status(500)
        .json({ message: "Failed to create new User", statusCode: 500 });
    }
  }
  async updateUser(req, res) {
    try {
      const { user_id } = req.params;
      const { email, name, password, role_id } = req.body;

      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          message: "User not found!",
        });
      }

      const updatedUser = await user.update({
        email: email,
        name: name,
        password: bcrypt.hashSync(password, 10),
      });

      await UserHasRole.update(
        { role_id: role_id },
        { where: { user_id: user_id } }
      );

      return res.status(200).json({
        message: "Success Update User",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async destroyUser(req, res) {
    try {
      const { user_id } = req.params;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          message: "User not found!",
        });
      }

      await user.destroy();
      return res.status(200).json({
        message: "Successfully Delete User",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const { user_id } = req.params;

      const user = await User.findOne({
        where: {
          id: user_id,
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
        return res.status(404).json({
          message: "User not found",
        });
      }

      const validStatusValues = [true, false];

      if (status && !validStatusValues.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "User does not have a status",
        });
      }

      await user.update({ status: status });

      return res.status(200).json({
        message: "Role status updated successfully",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new UserWebController();
