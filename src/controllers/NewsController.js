import {
  Approval,
  Member,
  News,
  NewsImage,
  NewsSavedByMember,
  Category,
  Notification,
  Declined,
} from "../models/index";
import { Op, where } from "sequelize";
import sequelize from "../models/sequelize";
import moment from "moment";

class NewsController {
  async getNews(req, res) {
    try {
      const { status, sort, category_id } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      const news = await News.findAndCountAll({
        include: [
          {
            model: NewsImage,
            required: false,
          },
          {
            model: NewsSavedByMember,
            where: {
              ...(req.auth?.user?.Member.id && {
                member_id: req.auth?.user?.Member.id,
              }),
            },
            include: {
              model: Member,
            },
            required: false,
          },
          {
            model: Category,
            attributes: ["id", "name"],
            where: {
              ...(category_id && { id: category_id }),
            },
          },
        ],
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
        },
        offset: offset,
        limit: limit,
      });
      const data = news.rows.map((el) => {
        const _el = el.toJSON();
        const news_image = _el.NewsImages.map((el) => {
          return el.url;
        });
        console.log(news_image);

        // console.log(_el.Category.id);
        const category = {
          id: _el.Category.id,
          name: _el.Category?.name,
        };
        return {
          id: _el.id,
          title: _el.title,
          date: moment(_el.date).locale("id").format("DD MMMM YYYY"),
          time: moment(_el.time, "hh:mm").locale("id").format("hh:mm"),
          editor_name: _el.editor_name ?? "-",
          body: _el.body,
          is_saved_by_me: _el.NewsSavedByMembers.length > 0,
          news_image,
          category_id: _el.Category.id,
          category: category.name ?? null,
        };
      });

      const totalPage = Math.ceil(news.count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      return res.status(200).json({
        message: "Success Read Data",
        data,
        limit: limit,
        totalRows: news.count,
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

  async getSavedNews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const news = await News.findAndCountAll({
        include: [
          {
            model: NewsImage,
            required: false,
          },
          {
            model: NewsSavedByMember,
            where: {
              member_id: req.auth.user.Member.id,
            },
            required: true,
          },
          {
            model: Category,
            attributes: ["name"],
          },
        ],
        offset: offset,
        limit: limit,
      });
      const data = news.rows.map((el) => {
        const _el = el.toJSON();
        const news_image = _el.NewsImages.map((el) => {
          return el.url;
        });
        return {
          id: _el.id,
          title: _el.title,
          date: moment(_el.date).locale("id").format("DD MMMM YYYY"),
          time: moment(_el.time, "hh:mm").locale("id").format("hh:mm"),
          editor_name: _el.editor_name ?? "-",
          body: _el.body,
          category: _el.Category,
          is_saved_by_me: _el.NewsSavedByMembers.length > 0,
          news_image,
        };
      });

      const totalPage = Math.ceil(news.count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      return res.status(200).json({
        message: "Success Read Data",
        data,
        limit: limit,
        totalRows: news.count,
        totalPage: totalPage,
        nextPage: nextPage,
        prevPage: prevPage,
      });
    } catch (error) {
      console.log("Failure fetch saved news ===> " + error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
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
            model: NewsSavedByMember,
            where: {
              ...(req.auth?.user?.Member.id && {
                member_id: req.auth?.user?.Member.id,
              }),
            },
            include: {
              model: Member,
            },
            required: false,
          },
          {
            model: Category,
            attributes: ["name"],
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
        title: _news.title,
        date: moment(_news.date).locale("id").format("DD MMMM YYYY"),
        time: moment(_news.time, "hh:mm").locale("id").format("hh:mm"),
        editor_name: _news.editor_name ?? "-",
        body: _news.body,
        category_id: category.id ?? null,
        category: category.name ?? null,
        is_saved_by_me: _news.NewsSavedByMembers.length > 0,
        news_image,
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

  async createNews(req, res) {
    const t = await sequelize.transaction();
    try {
      const { title, date, time, body, editor_name, category_id } = req.body;

      const approval = await Approval.create({});

      const payloadNews = {
        member_id: req.auth.user.Member.id,
        approval_id: approval.id,
        status: "waiting",
        editor_name,
        category_id: category_id,
        title,
        date: moment(date, "DD/MM/YYYY").toDate(),
        time,
        body,
      };

      const createdNews = await News.create(payloadNews, { transaction: t });
      let image = [];
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const fp = req.files[i].path;

          const newsImage = {
            news_id: createdNews.get("id"),
            url: fp,
          };
          const arr = await NewsImage.create(newsImage, { transaction: t });
          image.push(arr.url);
        }
      }
      const data = {
        id: createdNews.id,
        member_id: createdNews.member_id,
        approval_id: createdNews.approval_id,
        status: createdNews.status,
        editor_name: createdNews.editor_name,
        category_id: createdNews.category_id,
        title: createdNews.title,
        date: createdNews.date,
        time: createdNews.time,
        body: createdNews.body,
        url: image,
      };
      await t.commit();

      res.status(201).json({
        message: "Success Create Data",
        data: data,
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async updateNews(req, res) {
    const t = await sequelize.transaction();
    try {
      const { news_id } = req.params;
      const { status, title, date, time, body } = req.body;

      const updatedNews = await News.findByPk(news_id);

      if (!updatedNews) {
        return res.status(404).json({
          message: "News not found",
        });
      }
      const validStatusValues = ["approved", "waiting", "rejected"];

      if (status && !validStatusValues.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }
      await updatedNews.update(
        {
          status,
          title,
          date,
          time,
          body,
        },
        {
          transaction: t,
        }
      );

      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const fp = req.files[i].path;
          const z = {
            news_id: news_id,
            url: fp,
          };

          await NewsImage.create(z, { transaction: t });
        }
      }

      await t.commit();

      res.status(200).json({
        message: "News updated successfully",
        data: updatedNews,
      });
    } catch (error) {
      await t.rollback();

      console.log(error);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async saveNews(req, res) {
    const t = await sequelize.transaction();
    try {
      const { news_id } = req.params;
      const news = await News.findByPk(news_id);
      if (!news) {
        return res.status(404).json({
          message: "News not Found",
        });
      }
      const payloadNewsSavedByMember = {
        member_id: req.auth.user.Member.id,
        news_id: news_id,
      };
      const [saved, isCreated] = await NewsSavedByMember.findOrCreate({
        where: payloadNewsSavedByMember,
        defaults: payloadNewsSavedByMember,
      });
      if (!isCreated) {
        return res.status(422).json({
          message: "You already saved this news",
        });
      }
      await t.commit();
      res.status(201).json({
        message: "Successfully added news to favorites",
        data: saved,
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async unSaveNews(req, res) {
    try {
      const { news_id } = req.params;
      const savedNews = await NewsSavedByMember.findOne({
        where: {
          member_id: req.auth.user.Member.id,
          news_id,
        },
      });
      if (!savedNews) {
        return res.status(422).json({
          message: "You not save this news",
        });
      }
      await savedNews.destroy();
      return res.status(200).json({
        message: "Saved news successfully removed!",
      });
    } catch (error) {
      console.log("Failure Unsaved the news ===>" + error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async updateEventRejected(req, res) {
    const t = await sequelize.transaction();

    try {
      const { news_id } = req.params;
      const { status, title, date, time, body } = req.body;

      const newsRejected = await News.findByPk(news_id, {
        include: [
          {
            model: Member,
            attributes: ["id", "name"],
          },
          {
            model: Approval,
            attributes: ["id", "declined_id"],
          },
        ],
        transaction: t, // Menambahkan transaksi pada pencarian newsRejected
      });

      if (!newsRejected || newsRejected.status !== "rejected") {
        await t.rollback(); // Membatalkan transaksi
        return res.status(400).json({
          message: "Only rejected news can be edited",
        });
      }

      const declined_id = newsRejected.Approval.declined_id;

      const newsData = {
        status: "waiting",
        title,
        date,
        time,
        body,
      };

      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const fp = req.files[i].path;
          const z = {
            news_id: news_id,
            url: fp,
          };

          await NewsImage.create(z, { transaction: t });
        }
      }

      await News.update(newsData, {
        where: {
          id: news_id,
        },
        transaction: t,
      });

      newsRejected.Approval.user_id = null;
      newsRejected.Approval.declined_id = null;
      await newsRejected.Approval.save({ transaction: t });

      await t.commit();

      res.status(200).json({
        message: "Successfully update data",
      });
    } catch (e) {
      await t.rollback();

      console.error("Failed to update News =>", e);

      return res.status(500).json({
        message: "Failed to update News",
        statusCode: 500,
      });
    }
  }
}

export default new NewsController();
