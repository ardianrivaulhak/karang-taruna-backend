import { Op } from "sequelize";
import { Member, Notification, News, Event } from "../models";
import sequelize from "../models/sequelize";

class NotificationController {
  async getNotifNews(req, res) {
    try {
      const notifications = await Notification.findAll({
        where: {
          ...(req.auth.user.Member.id && {
            member_id: req.auth.user.Member.id,
          }),
          [Op.not]: [{ status: "waiting" }],
        },
        attributes: { exclude: ["created_at", "updated_at", "deleted_at"] },
      });

      const updatedNotifications = notifications.map((x) => {
        let text;
        if (x.type === "news") {
          text =
            x.status === "approved"
              ? "Berita telah disetujui"
              : "Berita tidak disetujui";
        } else if (x.type === "event") {
          text =
            x.status === "approved"
              ? "Acara telah disetujui"
              : "Acara tidak disetujui";
        }

        return {
          id: x.id,
          label: x.label,
          status: x.status,
          type: x.type,
          date: x.date,
          statusText: text,
        };
      });

      res.status(200).json({
        message: "Success Read Data",
        data: updatedNotifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default new NotificationController();
