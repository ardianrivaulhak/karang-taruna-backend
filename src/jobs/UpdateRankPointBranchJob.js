import UpdateRankPointBranchJob from "../services/UpdateRankPointBranchJob.js";

const updateRankJob = async () => {
  await UpdateRankPointBranchJob.start();
};

updateRankJob();
