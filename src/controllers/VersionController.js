import { MobileVersion } from "../models/index";

class VersionController {
  async check(req, res) {
    const { name = null, version = null } = req.params;
    const currentVersion = await MobileVersion.findOne({
      where: { name, active: true },
    });

    if (!currentVersion) {
      return res.status(503).json({ message: "Aplikasi dalam perawatan!" });
    }

    if (
      currentVersion.get("version") !== version &&
      currentVersion.get("status") == "release"
    ) {
      return res.status(403).json({
        message: "Silahkan perbaharui aplikasi untuk melanjutkan!",
        data: currentVersion,
      });
    }

    if (
      currentVersion.get("version") !== version &&
      currentVersion.get("status") == "review"
    ) {
      return res.status(200).json({
        message: "Aplikasi baru sedang dalam proses",
        data: currentVersion,
      });
    }

    return res.json({
      message: "success",
      data: currentVersion,
    });
  }

  async lastest(req, res) {
    try {
      const currentVersion = await MobileVersion.findOne({
        where: { active: true },
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json({
        message: "success",
        data: currentVersion,
      });
    } catch (error) {
      console.log("Failure Fetch Version App====> " + error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export default new VersionController();
