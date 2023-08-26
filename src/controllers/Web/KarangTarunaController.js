import { Op } from "sequelize";
import {
  Branch,
  Member,
  Village,
  District,
  City,
  Province,
  Position,
  Level,
} from "../../models";
import BranchHasPosition from "../../models/BranchHasPosition";
import sequelize from "../../models/sequelize";

class KarangnTarunaController {
  async getYouthOrganization(req, res) {
    try {
      const { sort, province_id } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      let order = [];
      switch (sort) {
        case "since-asc":
          order.push(["created_at", "ASC"]);
          break;
        case "since-desc":
          order.push(["created_at", "DESC"]);
          break;
        case "Nasional":
          order.push([Level, "position", "ASC"]);
          break;
        case "Provinsi":
          order.push([Level, "name", "ASC"]);
          break;
        case "Kota/Kabupaten":
          order.push([Level, "name", "ASC"]);
          break;
        case "Kecamatan":
          order.push([Level, "name", "ASC"]);
          break;
        case "Desa/Kelurahan":
          order.push([Level, "name", "ASC"]);
          break;
        default:
          order.push(["created_at", "DESC"]);
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
          {
            model: Level,
          },
          {
            model: Position,
            attributes: ["id", "name"],
          },
        ],
        where: whereClause,
        order: order,
        offset: offset,
        limit: limit,
      });

      const data = branches.map((el) => {
        const _el = el.toJSON();
        console.log(_el);
        const positions = _el.Positions.map((el) => {
          delete el.BranchHasPosition;
          return el;
        });
        return {
          id: _el.id,
          name: _el.name,
          level_id: _el.Level?.id ?? "-",
          level_name: _el.Level?.name ?? "-",
          count_members: _el.Members.length ?? 0,
          province_id: _el.Village.District.City.Province.id,
          province_name: _el.Village.District.City.Province.name,
          city_id: _el.Village.District.City.id,
          city_name: _el.Village.District.City.name,
          district_id: _el.Village.District.id,
          district_name: _el.Village.District.name,
          village_id: _el.Village.id,
          village_name: _el.Village.name,
          point: _el.current_point ?? 0,
          positions,
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
      console.log(branch_id);
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
            // required: true,
          },
          {
            model: Level,
            // required: true,
          },
          {
            model: Village,
            // required: true,
            include: {
              model: District,
              // required: true,
              include: {
                model: City,
                // required: true,
                include: {
                  model: Province,
                  // required: true,
                },
              },
            },
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
        number_of_members: _el?.Members?.length ?? null,
        province_id: _el.Village.District.City.Province.id,
        province_name: _el.Village.District.City.Province.name,
        city_id: _el.Village.District.City.id,
        city: _el.Village?.District.City?.name ?? null,
        district_id: _el.Village.District.id,
        district: _el.Village?.District?.name ?? null,
        village_id: _el.Village?.id ?? null,
        village: _el.Village?.name ?? null,
        membership: _el.Positions,
      };

      res.status(200).json({
        message: "Branch successfully",
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

  async create(req, res) {
    let t;
    try {
      t = await sequelize.transaction();

      const { name, level_id, position_id, village_id } = req.body;

      const branch = await Branch.create(
        {
          name,
          village_id,
          level_id,
        },
        { transaction: t }
      );

      for (const position of position_id) {
        await BranchHasPosition.create(
          { branch_id: branch.id, position_id: position },
          { transaction: t }
        );
      }

      await t.commit();

      return res
        .status(200)
        .json({ message: "Branch added successfully", data: branch });
    } catch (error) {
      console.log(error);
      if (t) await t.rollback();

      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    let t;
    try {
      t = await sequelize.transaction();

      const { name, level_id, position_id, village_id } = req.body;
      const { branch_id } = req.params;

      const branch = await Branch.findByPk(branch_id);

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      await branch.update(
        {
          name,
          village_id,
          level_id,
        },
        { transaction: t }
      );

      await BranchHasPosition.destroy({
        where: { branch_id: branch.id },
        transaction: t,
      });

      for (const position of position_id) {
        await BranchHasPosition.create(
          { branch_id: branch.id, position_id: position },
          { transaction: t }
        );
      }

      await t.commit();

      return res.status(200).json({
        message: "Branch updated successfully",
        data: branch,
      });
    } catch (error) {
      console.log(error);
      if (t) await t.rollback();

      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const { branch_id } = req.params;

      const deletedBranchCount = await Branch.destroy({
        where: { id: branch_id },
      });

      if (deletedBranchCount === 0) {
        return res.status(404).json({ message: "Branch not found" });
      }

      return res.status(200).json({ message: "Branch deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export default new KarangnTarunaController();
