import UpdateRankPointBranchJob from "../services/UpdateRankPointBranchJob";

class CronJobController {
  async updateRankPointBranch(req, res) {
    try {
      await UpdateRankPointBranchJob.start();
      return res.status(200).json({
        message: "Branch rank successfully updated",
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

export default new CronJobController();
