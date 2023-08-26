import moment from "moment";
import { Op, Sequelize } from "sequelize";
import {
  Branch,
  Member,
  News,
  Event,
  Survey,
  Potential,
  Job,
  Village,
  District,
  City,
  Province,
  SurverPotential,
} from "../../models";
import sequelize from "../../models/sequelize";

class DashboardController {
  async getTotal(req, res) {
    try {
      const totalBranchs = await Branch.count();
      const totalMembers = await Member.count();
      const totalNews = await News.count();
      const totalEvents = await Event.count();
      const futureDate = moment().add(7, "days").startOf("day").toDate();
      const additionalBranchs = await Branch.count({
        where: {
          created_at: {
            [Op.gte]: futureDate,
          },
        },
      });

      const additionalMembers = await Member.count({
        where: {
          created_at: {
            [Op.gte]: futureDate,
          },
        },
      });

      const additionalNews = await News.count({
        where: {
          created_at: {
            [Op.gte]: futureDate,
          },
        },
      });

      const additionalEvents = await Event.count({
        where: {
          created_at: {
            [Op.gte]: futureDate,
          },
        },
      });

      const data = {
        total_branchs: totalBranchs,
        total_members: totalMembers,
        total_news: totalNews,
        total_events: totalEvents,
        branch_increase_percentage:
          additionalBranchs > 0
            ? Math.floor((additionalBranchs / totalBranchs) * 100)
            : "No increase in branches",
        member_increase_percentage:
          additionalMembers > 0
            ? Math.floor((additionalMembers / totalMembers) * 100)
            : "No increase in members",
        news_increase_percentage:
          additionalNews > 0
            ? Math.floor((additionalNews / totalNews) * 100)
            : "No increase in news",
        event_increase_percentage:
          additionalEvents > 0
            ? Math.floor((additionalEvents / totalEvents) * 100)
            : "No increase in events",
      };

      res.status(200).json({
        message: "Success read total",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
  async surveyPotentials(req, res) {
    try {
      const { province_id } = req.query;
      const surveyData = await Survey.findAll({
        attributes: ["issue"],
        include: [
          {
            model: Potential,
            as: "potentials",
            attributes: [
              ["name", "potential_name"],
              [sequelize.literal(`COUNT(potentials.name)`), "potential_count"],
            ],
            through: {
              model: SurverPotential,
              attributes: [],
            },
          },
          {
            model: Member,
            include: {
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
          },
        ],
        group: [
          "Survey.id",
          "potentials.id",
          "potentials->SurverPotential.id",
          "Member.id",
          "Member->Village.id",
          "Member->Village->District.id",
          "Member->Village->District->City.id",
          "Member->Village->District->City->Province.id",
        ],
      });

      const persentageSurvey = surveyData.map((e) => {
        const _el = e.toJSON();
        const name = _el.potentials.map((el) => {
          return el.potential_name;
        });

        const newObj = Object.keys(name).reduce((result, key) => {
          const newKey = "new_" + key;
          result[newKey] = name[key];
          return result;
        }, {});

        console.log(newObj);
        let pontential = {};
        _el.potentials.forEach((x) => {
          pontential = {
            potential_name: x.potential_name,
            potential_count: x.potential_count,
          };
        });
        return {
          survey_count: surveyData.length,
          pontential_count: pontential.potential_count,
          name: newObj.new_0,
          percentage: (pontential.potential_count / surveyData.length) * 100,
        };
      });

      return res.status(200).json({
        message: "Success",
        persentageSurvey,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async totalJobs(req, res) {
    try {
      const jobs = await Job.findAll({
        attributes: [
          ["name", "job_name"],
          [
            sequelize.literal(
              `(COUNT("Job"."id") * 100) / SUM(COUNT("Job"."id")) OVER ()`
            ),
            "job_count_percentage",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Jobs
            )`),
            "total_job_count",
          ],
        ],
        include: [
          {
            model: Member,
            as: "Members",
            attributes: [],
            where: sequelize.literal('"Members"."job_id" = "Job"."id"'),
          },
        ],
        group: ["Job.id"],
      });

      const total_members = await Member.count();

      const data = jobs.map((el) => {
        const _el = el.toJSON();
        return {
          job_name: _el.job_name,
          percentage: _el.job_count_percentage,
          total_job_count: _el.total_job_count,
          total_members: total_members,
        };
      });

      res.status(200).json({
        message: "Success read total data",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async highestLowest(req, res) {
    try {
      const { province_id, year } = req.query;
      let month = [
        "Januari",
        "Februari",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let arr = [];
      for (let i = 0; i <= month.length; i++) {
        const start = moment(year).month(i).startOf("month").toDate();
        const end = moment(year).month(i).endOf("month").toDate();

        const _newsApproved = await News.count({
          where: {
            created_at: {
              [Op.between]: [start, end],
            },
            [Op.and]: [
              {
                status: "approved",
              },
            ],
          },
        });
        const _newsRejected = await News.count({
          where: {
            created_at: {
              [Op.between]: [start, end],
            },
            [Op.and]: [
              {
                status: "rejected",
              },
            ],
          },
        });

        const _eventApproved = await Event.count({
          where: {
            created_at: {
              [Op.between]: [start, end],
            },
            [Op.and]: [
              {
                status: "approved",
              },
            ],
          },
        });

        const _eventRejected = await Event.count({
          where: {
            created_at: {
              [Op.between]: [start, end],
            },
            [Op.and]: [
              {
                status: "rejected",
              },
            ],
          },
        });
        const _news = await News.count({
          where: {
            created_at: {
              [Op.between]: [start, end],
            },
            [Op.and]: [
              {
                ...(province_id && {
                  "$Member.Village.District.City.Province.id$": province_id,
                }),
              },
            ],
          },
          include: [
            {
              model: Member,
              attributes: [],
              include: {
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
            },
          ],
        });

        const _events = await Event.count({
          where: {
            created_at: {
              [Op.between]: [start, end],
            },
          },
          include: [
            {
              model: Member,
              attributes: [],
              include: {
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
            },
          ],
        });
        let obj = {
          labels: month[i],
          total_news: _news,
          news_approved: _newsApproved,
          news_rejected: _newsRejected,
          total_events: _events,
          event_approved: _eventApproved,
          event_rejected: _eventRejected,
        };
        arr.push(obj);
      }

      return res.status(200).json({
        message: "Successfully",
        data: arr,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async point(req, res) {
    try {
      const { province_id } = req.query;
      const memberData = await Member.findAll({
        attributes: ["rating", "name"],
        include: [
          {
            model: Branch,
            required: true,
            attributes: ["current_point", "name"],
            include: {
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
          },
          {
            model: News,
            attributes: ["member_id"],
            where: {
              status: "approved",
            },
          },
          {
            model: Event,
            attributes: ["member_id"],
            where: {
              status: "approved",
            },
          },
        ],
        limit: 5,
      });

      const newsOrEvent = [];

      const data = memberData.forEach((member) => {
        const { Branch } = member;

        const events_point_branch = member.Events.length;
        const news_point_branch = member.News.length;
        const found = newsOrEvent.find((el) => {
          return el.branch === Branch.name;
        });

        if (found) {
          found.events_point_branch += member.Events.length;
          found.news_point_branch += member.News.length;
        } else {
          newsOrEvent.push({
            branch: Branch.name,
            events_point_branch,
            news_point_branch,
          });
        }
      });

      res.status(200).json({
        message: "Successfully read total point",
        data: newsOrEvent,
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

export default new DashboardController();
