import moment from "moment";
import { Op } from "sequelize";
import {
  Branch,
  City,
  District,
  Job,
  Level,
  Member,
  Otp,
  Position,
  Potential,
  Province,
  SurverPotential,
  Survey,
  User,
  Village,
} from "../../models";
import BranchHasPosition from "../../models/BranchHasPosition";

class MemberWebController {
  async getMember(req, res) {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { rows: members, count } = await Member.findAndCountAll({
        include: {
          model: User,
          include: {
            model: Otp,
          },
        },
        where: {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },

        offset: offset,
        limit: limit,
      });

      const format = (members) => {
        const el = members.toJSON();
        return {
          id: el.id,
          join_date: moment(el.created_at).locale("id").format("DD MMMM YYYY"),
          name: el.name,
          membership_no: el.membership_no,
          no_whatsapp: el.User?.phone_number ? el.User?.phone_number : null,
        };
      };

      const formattedMembers = members.map(format);

      const totalPage = Math.ceil(count / limit);
      const prevPage = page === 1 ? null : page - 1;
      const nextPage = page === totalPage ? null : page + 1;

      res.status(200).json({
        message: "Success",
        data: formattedMembers,
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

  async findMe(req, res) {
    try {
      const { member_id } = req.params;

      const member = await Member.findByPk(member_id, {
        include: [
          {
            model: User,
          },
          {
            model: Position,
          },
          {
            model: Branch,

            attributes: ["id", "name"],
            include: [
              {
                model: Level,
              },
              {
                model: Position,
                through: BranchHasPosition,
              },
              {
                model: Village,
                required: true,
                attributes: ["id", "name"],
                include: {
                  model: District,
                  required: true,

                  attributes: ["id", "name"],
                  include: {
                    model: City,
                    required: true,

                    attributes: ["id", "name"],
                    include: {
                      model: Province,
                      required: true,

                      attributes: ["id", "name"],
                    },
                  },
                },
              },
            ],
          },
        ],
      });

      if (!member) {
        return res.status(404).json({
          message: "Member not found ",
        });
      }

      const _member = member.toJSON();
      const data = {
        id: _member.id,
        username: _member.username,
        email: _member.User?.email ?? null,
        phone_number: _member.User?.phone_number ?? null,
        name: _member.name,
        nik: _member.nik,
        membership_no: _member.membership_no,
        photo_url: _member.photo_url,
        gender: _member.gender,
        job: _member.job,
        date_of_birth: moment(_member.date_of_birth).format("DD/MM/YYYY"),
        address: _member.address,
        location: `${_member.Branch.Village.District.name}, ${_member.Branch?.Village?.District.City.name}`,
        branch_id: _member.Branch.id ?? null,
        branch_name: _member.Branch.name ?? null,
        keanggotaan: _member.Position.name,
        membership_type: _member.Branch.Level.name,
        // level: _member?.Branch?.Positions,
        qr_url: _member.qr_url,
        province_id: _member.Branch?.Village?.District.City.Province.id,
        province_name: _member.Branch?.Village?.District.City.Province.name,
        city_id: _member.Branch?.Village?.District.City.id,
        city_name: _member.Branch?.Village?.District.City.name,
        district_id: _member.Branch?.Village?.District.id,
        district_name: _member.Branch?.Village?.District.name,
        village_id: _member.Branch?.Village?.id,
        village_name: _member.Branch?.Village?.name,
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

  async findSurvey(req, res) {
    try {
      const { member_id } = req.params;

      const member = await Member.findByPk(member_id, {
        include: [
          {
            model: Survey,
            include: {
              model: Potential,
              as: "potentials",
            },
          },
        ],
      });

      const _member = member.Surveys.map((el) => {
        const _el = el.toJSON();
        console.log(_el);
        const potentials = _el.potentials.map((x) => {
          return x.name;
        });
        return {
          potentials: potentials,
          potential_explanation: _el.potential_explanation,
          expectation: _el.expectation,
          issue: _el.issue,
          criticism_and_suggestion: _el.criticism_and_suggestion,
        };
      });

      return res.status(200).json({
        message: "success",
        data: _member,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async updateMe(req, res) {
    try {
      const { member_id } = req.params;

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
      const member = await Member.findByPk(member_id);

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

  async destroy(req, res) {
    try {
      const { member_id } = req.params;

      const member = await Member.findByPk(member_id);

      if (!member) {
        return res.status(404).json({
          message: "Member not found",
        });
      }

      await member.destroy();

      return res.status(200).json({
        message: "Member deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to delete member",
        error: error.message,
      });
    }
  }
}

export default new MemberWebController();
