import { Router } from "express";
import LeaderBoardController from "../../controllers/Web/LeaderBoardController";
import VerifyRole from "../../middlewares/VerifyRole";
import VerifyToken from "../../middlewares/VerifyToken";

const routes = Router();

routes.get(
  "/disctrict",
  VerifyToken.handle,
  VerifyRole.Admin,
  LeaderBoardController.getByDistrict.bind(LeaderBoardController)
);
routes.get(
  "/city",
  VerifyToken.handle,
  VerifyRole.Admin,
  LeaderBoardController.getByCity.bind(LeaderBoardController)
);
routes.get(
  "/:branch_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  LeaderBoardController.detail.bind(LeaderBoardController)
);

export default routes;
