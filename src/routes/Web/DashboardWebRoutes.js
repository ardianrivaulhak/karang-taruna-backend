import { Router } from "express";
import DashboardController from "../../controllers/Web/DashboardController";
import VerifyRole from "../../middlewares/VerifyRole";
import VerifyToken from "../../middlewares/VerifyToken";

const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Admin,
  DashboardController.getTotal.bind(DashboardController)
);
routes.get(
  "/survey",
  VerifyToken.handle,
  VerifyRole.Admin,
  DashboardController.surveyPotentials.bind(DashboardController)
);
routes.get(
  "/jobs",
  VerifyToken.handle,
  VerifyRole.Admin,
  DashboardController.totalJobs.bind(DashboardController)
);
routes.get(
  "/perfoms",
  VerifyToken.handle,
  VerifyRole.Admin,
  DashboardController.highestLowest.bind(DashboardController)
);

routes.get(
  "/point",
  VerifyToken.handle,
  VerifyRole.Admin,
  DashboardController.point.bind(DashboardController)
);

export default routes;
