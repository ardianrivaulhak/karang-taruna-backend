import {
  Event,
  Member,
  Approval,
  Notification,
  Declined,
} from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../models/sequelize";
import moment from "moment";

class EventController {
  async getEvent(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      let whereCondition = {
        title: {
          [Op.iLike]: `%${search}%`,
        },
        status: "approved",
      };

      if (req.auth?.user?.Member?.id) {
        whereCondition.member_id = req.auth.user.Member.id;
      }

      const { rows: events, count } = await Event.findAndCountAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
      });

      const data = events.map((el) => {
        const _el = el.toJSON();
        return {
          id: _el.id,
          status: _el.status,
          title: _el.title,
          date: moment(_el.date).locale("id").format("DD MMMM YYYY"),
          start_time: moment(_el.start_time, "hh:mm")
            .locale("id")
            .format("hh:mm"),
          end_time: moment(_el.end_time, "hh:mm").locale("id").format("hh:mm"),
          location: _el.location,
          sponsor_name: _el.sponsor_name,
          body: _el.body,
          poster_url: _el.poster_url,
        };
      });

      const totalPage = Math.ceil(count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      return res.status(200).json({
        message: "Success Read Data",
        data: data,
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
      const event_id = req.params.event_id;
      const event = await Event.findByPk(event_id);

      const data = {
        id: event.id,
        status: event.status,
        title: event.title,
        date: moment(event.date).locale("id").format("DD MMMM YYYY"),
        start_time: moment(event.start_time, "hh:mm")
          .locale("id")
          .format("hh:mm"),
        end_time: moment(event.end_time, "hh:mm").locale("id").format("hh:mm"),
        location: event.location,
        sponsor_name: event.sponsor_name,
        body: event.body,
        poster_url: event.poster_url,
      };

      res.status(200).json({
        message: "Success Read Event By ID",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async createEvent(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        status,
        title,
        date,
        start_time,
        end_time,
        location,
        sponsor_name,
        body,
      } = req.body;

      const approval = await Approval.create({});

      const eventData = {
        member_id: req.auth.user.Member.id,
        approval_id: approval.get("id"),
        status: "waiting",
        title: title,
        date: moment(date, "DD/MM/YYYY").toDate(),
        start_time: moment(start_time, "hh:mm").locale("id").format("hh:mm"),
        end_time: moment(end_time, "hh:mm").locale("id").format("hh:mm"),
        location: location,
        sponsor_name: sponsor_name,
        body: body,
      };

      if (req.file) {
        eventData.poster_url = req.file.path;
      }

      if (!eventData.poster_url) {
        return res.status(401).json({
          message: "poster_url required",
        });
      }

      const createdEvent = await Event.create(eventData, { transaction: t });

      await t.commit();

      res.status(201).json({
        message: "Success Create Data",
        data: createdEvent,
      });
    } catch (error) {
      console.log(error);
      await t.rollback();

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const { event_id } = req.params;
      const {
        status,
        title,
        date,
        start_time,
        end_time,
        location,
        sponsor_name,
        body,
      } = req.body;

      const validStatusValues = ["approved", "waiting", "rejected"];

      if (status && !validStatusValues.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const eventData = {
        status,
        title,
        date,
        start_time,
        end_time,
        location,
        sponsor_name,
        body,
      };

      if (req.file) {
        eventData.poster_url = req.file.path;
      }
      await Event.update(eventData, {
        where: {
          id: event_id,
        },
      });

      res.status(200).json({
        message: "Event updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async deleteEvent(req, res) {
    const t = await sequelize.transaction();

    try {
      const event_id = req.params.event_id;

      await Event.destroy({ where: { id: event_id }, transaction: t });

      await t.commit();

      return res.json({
        message: "Event deleted",
        statusCode: 200,
      });
    } catch (e) {
      console.error("Failed to delete Event =>", e);
      await t.rollback();

      return res
        .status(500)
        .json({ message: "Failed to delete Event", statusCode: 500 });
    }
  }

  async updateEventRejected(req, res) {
    const t = await sequelize.transaction();

    try {
      const { event_id } = req.params;
      const {
        status,
        title,
        date,
        start_time,
        end_time,
        location,
        sponsor_name,
        body,
      } = req.body;

      const eventRejected = await Event.findByPk(event_id, {
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
        transaction: t, // Menambahkan transaksi pada pencarian eventRejected
      });

      if (!eventRejected || eventRejected.status !== "rejected") {
        await t.rollback(); // Membatalkan transaksi
        return res.status(400).json({
          message: "Only rejected events can be edited",
        });
      }

      const declined_id = eventRejected.Approval.declined_id;

      const eventData = {
        status: "waiting",
        title,
        date,
        start_time,
        end_time,
        location,
        sponsor_name,
        body,
      };

      if (req.file) {
        eventData.poster_url = req.file.path;
      }

      await Event.update(eventData, {
        where: {
          id: event_id,
        },
        transaction: t,
      });

      eventRejected.Approval.user_id = null;
      eventRejected.Approval.declined_id = null;

      await eventRejected.Approval.save({ transaction: t });

      await t.commit();
      res.status(200).json({
        message: "Successfully update data",
      });
    } catch (e) {
      await t.rollback();

      console.error("Failed to update Event =>", e);

      return res.status(500).json({
        message: "Failed to update Event",
        statusCode: 500,
      });
    }
  }
}

export default new EventController();
