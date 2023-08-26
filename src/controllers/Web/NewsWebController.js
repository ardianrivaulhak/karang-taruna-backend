import { Op, Sequelize } from "sequelize";
import {
  News,
  NewsImage,
  Category,
  Declined,
  Approval,
  Member,
  NewsSavedByMember,
  Notification,
  Branch,
  User,
} from "../../models";
import sequelize from "../../models/sequelize";
import moment from "moment";
class NewsWebController {
  async getNews(req, res) {
    try {
      const { status, sort, category_id } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;
      let order;
      switch (sort) {
        case "since-asc":
          order = [["Approval", "date", "ASC"]];
          break;
        case "since-desc":
          order = [["Approval", "date", "DESC"]];
          break;
        default:
          order = [["Approval", "date", "DESC"]];
          break;
      }

      const whereCondition = {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      };

      if (status) {
        whereCondition.status = status;
      }

      const { rows: news, count } = await News.findAndCountAll({
        include: [
          {
            model: NewsImage,
            required: false,
          },
          {
            model: Category,
            attributes: ["id", "name"],
            where: {
              ...(category_id && { id: category_id }),
            },
          },
          {
            model: Approval,
            include: [
              {
                model: User,
              },
              {
                model: Declined,
              },
            ],
          },
          {
            model: Member,
          },
        ],
        order: order,
        where: whereCondition,
        offset: offset,
        limit: limit,
      });

      const formatNews = (news) => {
        const _news = news.toJSON();
        const news_images = _news.NewsImages.map((el) => el.url);
        const category = {
          id: _news.Category?.id,
          name: _news.Category?.name,
        };

        return {
          id: _news.id,
          status: _news.status,
          headLine_berita: _news.title,
          date: moment(_news.date).locale("id").format("DD MMMM YYYY"),
          time: moment(_news.time, "hh:mm").locale("id").format("hh:mm"),
          tanggal_dibuat: moment(_news.created_at)
            .locale("id")
            .format("DD/MM/YYYY"),
          waktu_dibuat: moment(_news.created_at, "hh:mm")
            .locale("id")
            .format("hh:mm"),
          location: _news.location,
          sponsor_name: _news.sponsor_name,
          redaktur: _news.Member.name,
          isi_berita: _news.body,
          news_images,
          category_id: category.id ?? null,
          category: category.name ?? null,
          waktu_disetujui:
            _news.status === "approved"
              ? moment(_news.Approval.date, "hh:mm")
                  .locale("id")
                  .format("hh:mm")
              : null,
          tanggal_disetujui:
            _news.status === "approved"
              ? moment(_news.Approval.date).locale("id").format("DD MMMM YYYY")
              : null,
          disetujui_oleh: _news.Approval?.User?.name ?? null,
          reasons: _news.Approval?.Declined?.reason ?? null,
        };
      };

      const formattedNews = news.map(formatNews);

      const totalPage = Math.ceil(count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      return res.status(200).json({
        message: "Successfully Read Data",
        data: formattedNews,
        page: page,
        limit: limit,
        totalRows: count,
        totalPage: totalPage,
        nextPage: nextPage,
        prevPage: prevPage,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async getDetail(req, res) {
    try {
      const { news_id } = req.params;
      const news = await News.findByPk(news_id, {
        include: [
          {
            model: NewsImage,
            required: false,
          },
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: Approval,
            include: [
              {
                model: Declined,
              },
              {
                model: User,
              },
            ],
          },
          {
            model: Member,
            // required: true,
          },
        ],
      });
      if (!news) {
        return res.status(404).json({
          message: "News not found",
        });
      }
      const _news = news.toJSON();

      const news_image = _news.NewsImages.map((el) => {
        return el.url;
      });
      const category = {
        id: _news.Category?.id,
        name: _news.Category?.name,
      };

      const data = {
        id: _news.id,
        status: _news.status,
        headLine_berita: _news.title,
        date: moment(_news.date).locale("id").format("DD MMMM YYYY"),
        time: moment(_news.time, "hh:mm").locale("id").format("hh:mm"),
        tanggal_dibuat: moment(_news.created_at)
          .locale("id")
          .format("DD/MM/YYYY"),
        location: _news.location,
        waktu_dibuat: moment(_news.created_at, "hh:mm")
          .locale("id")
          .format("hh:mm"),
        sponsor_name: _news.sponsor_name,
        redaktur: _news.Member.name,
        isi_berita: _news.body,
        news_image,
        category_id: category.id ?? null,
        category: category.name ?? null,
        waktu_disetujui:
          news.status === "approved"
            ? moment(news.Approval.date, "hh:mm").locale("id").format("hh:mm")
            : null,
        tanggal_disetujui:
          news.status === "approved"
            ? moment(news.Approval.date).locale("id").format("DD MMMM YYYY")
            : null,
        disetujui_oleh: news.Approval?.User?.name ?? null,
        reasons: _news.Approval?.Declined?.reason ?? null,
      };

      res.status(200).json({
        message: "Success Read News By ID",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async newsUpdateStatus(req, res) {
    try {
      const news_id = req.params.news_id;
      const { status, reason } = req.body;
      const validStatusValues = ["approved", "waiting", "rejected"];

      if (status && !validStatusValues.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      if (status === "rejected" && !reason) {
        return res.status(400).json({
          message: "Reason is required for rejecting the event",
        });
      }

      const newsData = {
        status: status,
        reason: status === "rejected" ? reason : null,
      };

      const news = await News.findByPk(news_id, {
        include: {
          model: Approval,
          include: [
            {
              model: Declined,
            },
            {
              model: User,
            },
          ],
        },
      });

      if (status === "approved") {
        news.Approval.date = moment().format("YYYY-MM-DD");
        news.Approval.user_id = req.auth.user.id;
        await news.Approval.save();
      }

      let responseMessage = "Status updated successfully";

      if (status === "rejected") {
        const declined = await Declined.create({
          reason: reason,
          type: "news",
        });

        news.Approval.declined_id = declined.id;
        await news.Approval.save();

        responseMessage += ` with reason: ${reason}`;
      }

      await News.update(newsData, { where: { id: news_id } });

      const afterUpdated = await News.findOne({
        where: { id: news_id },
        include: [
          {
            model: NewsSavedByMember,
            include: {
              model: Member,
            },
            required: false,
          },
          {
            model: Approval,
            include: {
              model: User,
            },
          },
        ],
      });

      const notifData = {
        member_id: afterUpdated.get("member_id"),
        news_id: afterUpdated.get("id"),
        event_id: null,
        label: afterUpdated.get("title"),
        status: afterUpdated.get("status"),
        type: "news",
        date: afterUpdated.get("date"),
      };

      if (
        afterUpdated.get("status") === "approved" ||
        afterUpdated.get("status") === "rejected"
      ) {
        await Notification.create(notifData, {
          where: {
            news_id: news_id,
          },
        });
      }

      if (afterUpdated.get("status") === "approved") {
        await Member.increment("rating", {
          by: 1,
          where: {
            id: afterUpdated.get("member_id"),
          },
        });
      }

      const branch = afterUpdated.toJSON();

      if (
        afterUpdated.get("branch_id") !== null &&
        afterUpdated.get("status") === "approved"
      ) {
        await Branch.increment("current_point", {
          by: 1,
          where: {
            id: branch?.member_id,
          },
        });
      }

      return res.status(201).json({
        message: responseMessage,
        afterUpdated,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async destroyNewsApproved(req, res) {
    try {
      const news_id = req.params.news_id;

      const news = await News.findOne({
        where: {
          id: news_id,
          status: "approved",
        },
      });

      if (!news) {
        return res.status(404).json({
          message: "News not approved or not found",
        });
      }

      await news.destroy();

      res.status(200).json({
        message: "News successfully deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default new NewsWebController();
