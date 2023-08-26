import moment from "moment";
import {
  Branch,
  City,
  District,
  Job,
  Level,
  Member,
  Position,
  Province,
  User,
  Village,
} from "../models";
import { Op } from "sequelize";
import path from "path";

class MemberController {
  async findAll(req, res) {
    try {
      const {
        search = "",
        sort,
        village_id,
        district_id,
        city_id,
        province_id,
      } = req.query;
      let col;
      let order;
      switch (sort) {
        case "since-asc":
          col = "created_at";
          order = "ASC";
          break;
        case "since-desc":
          col = "created_at";
          order = "DESC";
          break;
        default:
          col = "created_at";
          order = "DESC";
          break;
      }
      const members = await Member.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              membership_no: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        order: [[col, order]],
        include: [
          {
            model: Branch,
            attributes: ["name"],
          },
          {
            model: Village,
            attributes: ["name"],
            where: { ...(village_id && { id: village_id }) },
            include: {
              model: District,
              attributes: ["name"],
              where: { ...(district_id && { id: district_id }) },
              include: {
                model: City,
                attributes: ["name"],
                where: { ...(city_id && { id: city_id }) },
                include: {
                  model: Province,
                  where: { ...(province_id && { id: province_id }) },
                  attributes: ["name"],
                },
              },
            },
          },
        ],
      });

      const data = members.map((el) => {
        const member = el.toJSON();
        return {
          member_id: member.id,
          name: member.name,
          membership_no: member.membership_no,
          photo_url: member.photo_url,
          start_join: `Bergabung ${moment(member.created_at)
            .locale("id")
            .format("DD MMMM YYYY")}`,
          location: `${member.Village.District.name}, ${member.Village.District.City.name}`,
          branch: member.Branch?.name ?? "-",
        };
      });

      return res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "failed",
        error: error.message,
      });
    }
  }

  async findMe(req, res) {
    try {
      const memberId = req.auth.user.Member.id;
      const member = await Member.findByPk(memberId, {
        include: [
          {
            model: User,
          },
          {
            model: Branch,
            attributes: ["id", "name"],
          },
          {
            model: Village,
            attributes: ["id", "name"],
            include: {
              model: District,
              attributes: ["id", "name"],
              include: {
                model: City,
                attributes: ["id", "name"],
                include: {
                  model: Province,
                  attributes: ["id", "name"],
                },
              },
            },
          },
          {
            model: Job,
            as: "Job",
            attributes: ["id", "name"],
          },
          {
            model: Level,
            attributes: ["id", "name"],
          },
          {
            model: Position,
            attributes: ["id", "name"],
          },
        ],
      });
      const _member = member.toJSON();
      const data = {
        id: _member.id,
        username: _member.username,
        email: _member.User.email,
        phone_number: _member.User.phone_number,
        name: _member.name,
        nik: _member.nik,
        membership_no: _member.membership_no,
        photo_url: _member.photo_url,
        gender: _member.gender,
        job: _member.job,
        date_of_birth: moment(_member.date_of_birth).format("DD/MM/YYYY"),
        address: _member.address,
        branch_id: _member.Branch?.id ?? "-",
        branch_name: _member.Branch?.name ?? "-",
        qr_url: _member.qr_url,
        province_id: member.Village?.District?.City?.Province?.id ?? "-",
        province_name: member.Village?.District?.City?.Province?.name ?? "-",
        city_id: member.Village?.District?.City?.id ?? "-",
        city_name: member.Village?.District?.City?.name ?? "-",
        district_id: member.Village?.District?.id ?? "-",
        district_name: member.Village?.District?.name ?? "-",
        village_id: member.Village?.id ?? "-",
        village_name: member.Village?.name ?? "-",
        job_id: member.Job?.id ?? "-",
        job_name: member.Job?.name ?? "-",
        level_id: member.Level?.id ?? "-",
        level_name: member.Level?.name ?? "-",
        position_id: member.Position?.id ?? "-",
        position_name: member.Position?.name ?? "-",
      };
      return res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "failed",
        error: error.message,
      });
    }
  }

  async updateMe(req, res) {
    try {
      const {
        village_id,
        branch_id,
        nik,
        name,
        gender,
        address,
        date_of_birth,
        phone,
        email,
        job_id,
        level_id,
        position_id,
      } = req.body;
      const member = await Member.findByPk(req.auth.user.Member.id);
      const payload = {
        name,
        nik,
        phone,
        email,
        gender,
        date_of_birth: moment(date_of_birth, "DD/MM/YYYY").toDate(),
        village_id,
        address,
        branch_id,
        job_id,
        level_id,
        position_id,
      };
      if (req.file) {
        payload.photo_url = path.join(req.file.path);
      }
      await member.update(payload);
      await member.reload();
      return res.status(200).json({
        message: "Success",
        data: member,
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

export default new MemberController();
