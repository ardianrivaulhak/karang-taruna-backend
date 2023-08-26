import { Op } from "sequelize";
import {
  Branch,
  User,
  City,
  District,
  Member,
  Village,
  Province,
  Position,
  Level,
} from "../../models";
import BranchHasPosition from "../../models/BranchHasPosition";

class LeaderBoardController {
  async getByDistrict(req, res) {
    try {
      const { sort, city_id } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      let order;
      switch (sort) {
        case "lowest":
          order = [["current_point", "ASC"]];
          break;
        case "highest":
          order = [["current_point", "DESC"]];
          break;
        default:
          order = [["current_point", "DESC"]];
          break;
      }

      const whereClause = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      };

      const { rows: branches, count } = await Branch.findAndCountAll({
        include: [
          {
            model: Member,
          },
          {
            model: Position,
            through: {
              model: BranchHasPosition,
              attributes: [],
            },
            attributes: ["id", "name"],
          },
          {
            model: Village,
            required: true,
            include: {
              model: District,
              required: true,
              include: {
                model: City,
                required: true,
                where: { ...(city_id && { id: city_id }) },
                include: {
                  model: Province,
                  required: true,
                },
              },
            },
          },
        ],
        where: whereClause,
        order: order,
        offset: offset,
        limit: limit,
      });

      const data = branches.map((_el) => {
        return {
          id: _el.id,
          name: _el.name,
          point: _el.current_point,
          level: _el.Level?.name,
          number_of_members: _el.Members.length,
          city_id: _el.Village.District.City.id,
          city: _el.Village.District.City?.name,
          district_id: _el.Village.District.id,
          district: _el.Village.District?.name,
          village_id: _el.Village.id,
          village: _el.Village?.name,
          membership: _el.Positions,
        };
      });

      const totalPage = Math.ceil(count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      res.status(200).json({
        message: "Successfully read data",
        data: data,
        limit: limit,
        totalRows: count,
        totalPage: totalPage,
        nextPage: nextPage,
        prevPage: prevPage,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async getByCity(req, res) {
    try {
      const { sort, province_id } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      let order;
      switch (sort) {
        case "lowest":
          order = [["current_point", "ASC"]];
          break;
        case "highest":
          order = [["current_point", "DESC"]];
          break;
        default:
          order = [["current_point", "DESC"]];
          break;
      }

      const whereClause = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      };

      const { rows: branches, count } = await Branch.findAndCountAll({
        include: [
          {
            model: Member,
          },
          {
            model: Village,
            required: true,
            include: {
              model: District,
              required: true,
              include: {
                model: City,
                required: true,
                include: {
                  model: Province,
                  required: true,
                  where: { ...(province_id && { id: province_id }) },
                },
              },
            },
          },
        ],
        where: whereClause,
        order: order,
        offset: offset,
        limit: limit,
      });

      const data = branches.map((el) => {
        const _el = el.toJSON();
        return {
          id: _el.id,
          name: _el.name,
          point: _el.current_point ?? null,
          city_id: _el.Village.District.City.id ?? null,
          city: _el.Village.District.City.name ?? null,
          province_id: _el.Village.District.City.Province.id,
          provence: _el.Village.District.City.Province.name,
        };
      });

      const totalPage = Math.ceil(count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      res.status(200).json({
        message: "Successfully read data",
        data: data,
        page: page,
        limit: limit,
        totalRows: count,
        totalPage: totalPage,
        nextPage: nextPage,
        prevPage: prevPage,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async detail(req, res) {
    try {
      const branch_id = req.params.branch_id;
      const branch = await Branch.findByPk(branch_id, {
        include: [
          {
            model: Member,
          },
          {
            model: Position,
            through: {
              model: BranchHasPosition,
              attributes: [],
            },
            attributes: ["id", "name"],
          },
          {
            model: Level,
          },
          {
            model: Village,

            include: [
              {
                model: District,

                include: [
                  {
                    model: City,

                    include: [
                      {
                        model: Province,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!branch) {
        return res.status(404).json({
          message: "Branch not found",
        });
      }

      const _el = branch.toJSON();

      const data = {
        id: _el.id,
        name: _el.name,
        point: _el.current_point,
        level: _el.Level?.name,
        number_of_members: _el.Members.length,
        city_id: _el.Village.District.City.id,
        city: _el.Village.District.City?.name,
        district_id: _el.Village.District.id,
        district: _el.Village.District?.name,
        village_id: _el.Village.id,
        village: _el.Village?.name,
        membership: _el.Positions,
      };

      res.status(200).json({
        message: "Successfully read data",
        data: data,
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

export default new LeaderBoardController();
