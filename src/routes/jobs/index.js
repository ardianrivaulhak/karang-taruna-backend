import { Router } from "express";
import CronJobController from "../../controllers/CronJobController";
const routes = Router();

routes.post(
  "/rank-update",
  CronJobController.updateRankPointBranch.bind(CronJobController)
);

export default routes;
