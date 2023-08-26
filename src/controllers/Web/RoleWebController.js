import { Op } from "sequelize";
import { Role } from "../../models";
import sequelize from "../../models/sequelize";

class RoleWebController {
  async getRole(req, res) {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { rows: roles, count } = await Role.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },

        offset: offset,
        limit: limit,
      });

      if (count === 0) {
        return res.status(404).json({
          message: "No Role found",
        });
      }

      const totalPage = Math.ceil(count / limit);
      const prevPage = page === 1 ? null : page - 1;
      const nextPage = page === totalPage ? null : page + 1;

      res.status(200).json({
        message: "Success",
        data: roles,
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
        .json({ message: "An error occurred while fetching role data" });
    }
  }

  async createRole(req, res) {
    let t = await sequelize.transaction();
    try {
      const { name } = req.body;

      await Role.create({ name }, { transaction: t });

      await t.commit();

      res.status(201).json({
        message: "Success Create Role",
      });
    } catch (error) {
      console.log(error);

      await t.rollback();

      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default new RoleWebController();
