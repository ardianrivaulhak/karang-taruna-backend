import {
  Approval,
  Branch,
  Event,
  Member,
  Notification,
  User,
} from "../../models";
import { Op } from "sequelize";
import moment from "moment";
import Declined from "../../models/Declined";

class EvenWebController {
  async getEvent(req, res) {
    try {
      const { status, sort } = req.query;
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
      const { rows: events, count } = await Event.findAndCountAll({
        include: [
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
          },
        ],
        order: order,
        where: whereCondition,
        offset: offset,
        limit: limit,
      });

      const formatEvent = events.map((event) => {
        const _event = event.toJSON();
        return {
          id: _event.id,
          status: _event.status,
          nama_acara: _event.title,
          date: moment(_event.date).locale("id").format("DD MMMM YYYY"),
          start_time: moment(_event.start_time, "hh:mm")
            .locale("id")
            .format("hh:mm"),
          end_time: moment(_event.end_time, "hh:mm")
            .locale("id")
            .format("hh:mm"),
          waktu_acara: `${moment(_event.start_time, "hh:mm")
            .locale("id")
            .format("hh:mm")} - ${moment(_event.end_time, "hh:mm")
            .locale("id")
            .format("hh:mm")}`,
          pembuat_acara: _event.Member.name,
          tanggal_dibuat: moment(_event.created_at)
            .locale("id")
            .format("DD/MM/YYYY"),
          waktu_dibuat: moment(_event.created_at, "hh:mm")
            .locale("id")
            .format("hh:mm"),
          location: _event.location,
          sponsor_name: _event.sponsor_name,
          deskripsi_acara: _event.body,
          poster_acara: _event.poster_url,
          waktu_disetujui:
            _event.status === "approved"
              ? moment(_event.Approval.date, "hh:mm")
                  .locale("id")
                  .format("hh:mm")
              : null,
          tanggal_disetujui:
            _event.status === "approved"
              ? moment(_event.Approval.date).locale("id").format("DD MMMM YYYY")
              : null,
          disetujui_oleh: event.Approval.User?.name,
          reasons: _event.Approval?.Declined?.reason ?? null,
        };
      });
      const totalPage = Math.ceil(count / limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPage ? page + 1 : null;

      return res.status(200).json({
        message: "Successfully Read Data",
        data: formatEvent,
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
      const event_id = req.params.event_id;
      const event = await Event.findByPk(event_id, {
        include: [
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
          },
        ],
      });

      if (!event) {
        res.status(403).json({
          message: "Event not found",
        });
      }

      const _event = event.toJSON();

      const data = {
        id: _event.id,
        status: event.status,
        nama_acara: event.title,
        date: moment(event.date).locale("id").format("DD MMMM YYYY"),
        start_time: moment(event.start_time, "hh:mm")
          .locale("id")
          .format("hh:mm"),
        end_time: moment(event.end_time, "hh:mm").locale("id").format("hh:mm"),
        waktu_acara: `${moment(event.start_time, "hh:mm")
          .locale("id")
          .format("hh:mm")} - ${moment(event.end_time, "hh:mm")
          .locale("id")
          .format("hh:mm")}`,
        tanggal_dibuat: moment(event.created_at)
          .locale("id")
          .format("DD/MM/YYYY"),
        waktu_dibuat: moment(event.created_at, "hh:mm")
          .locale("id")
          .format("hh:mm"),
        lokasi_acara: event.location,
        sponsor_name: event.sponsor_name,
        pembuat_acara: _event.Member.name,
        deskripsi_acara: event.body,
        poster_acara: event.poster_url,
        waktu_disetujui:
          event.status === "approved"
            ? moment(event.Approval.date, "hh:mm").locale("id").format("hh:mm")
            : null,
        tanggal_disetujui:
          event.status === "approved"
            ? moment(event.Approval.date).locale("id").format("DD MMMM YYYY")
            : null,
        disetujui_oleh: event.Approval.User?.name,
        reasons: _event.Approval?.Declined?.reason ?? null,
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

  async eventUpdateStatus(req, res) {
    try {
      const event_id = req.params.event_id;
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

      const eventData = {
        status: status,
        reason: status === "rejected" ? reason : null,
      };

      const event = await Event.findByPk(event_id, {
        include: {
          model: Approval,
        },
      });

      if (!event) {
        res.status(403).json({
          message: "Event not found",
        });
      }

      if (status === "approved") {
        event.Approval.date = moment().format("YYYY-MM-DD");
        event.Approval.user_id = req.auth.user.id;
        await event.Approval.save();
      }

      await Event.update(eventData, { where: { id: event_id } });

      let responseMessage = "Status updated successfully";

      if (status === "rejected") {
        const declined = await Declined.create({
          reason: reason,
          type: "event",
        });
        responseMessage += ` with reason: ${reason}`;
        event.Approval.declined_id = declined.id;
        await event.Approval.save();
      }

      const afterUpdated = await Event.findOne({
        where: { id: event_id },
        include: [
          {
            model: Approval,
            include: {
              model: User,
            },
          },
          {
            model: Member,
          },
        ],
      });

      const jsonEvent = afterUpdated.toJSON();

      const notifData = {
        member_id: jsonEvent.member_id,
        news_id: null,
        event_id: jsonEvent.id,
        label: jsonEvent.title,
        status: jsonEvent.status,
        type: "event",
        date: jsonEvent.date,
      };

      if (jsonEvent.status === "approved" || jsonEvent.status === "rejected") {
        await Notification.create(notifData, {
          where: {
            event_id: event_id,
          },
        });
      }

      if (jsonEvent.status === "approved") {
        await Member.increment("rating", {
          by: 1,
          where: {
            id: jsonEvent.member_id,
          },
        });
      }

      if (
        jsonEvent.Member.branch_id !== null &&
        afterUpdated.get("status") === "approved"
      ) {
        await Branch.increment("current_point", {
          by: 1,
          where: {
            id: jsonEvent.Member.branch_id,
          },
        });
      }

      return res.status(200).json({
        message: responseMessage,
        jsonEvent,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async destroyEventApproved(req, res) {
    try {
      const event_id = req.params.event_id;

      const event = await Event.findOne({
        where: {
          id: event_id,
          status: "approved",
        },
      });

      if (!event) {
        return res.status(404).json({
          message: "Event not approved or not found",
        });
      }

      await event.destroy();

      res.status(200).json({
        message: "Event successfully deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default new EvenWebController();
