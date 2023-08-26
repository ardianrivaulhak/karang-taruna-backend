import { Router } from "express";
import VerifyToken from "../../middlewares/VerifyToken";
import VerifyRole from "../../middlewares/VerifyRole";
import PositionWebController from "../../controllers/Web/PositionWebController";

const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  PositionWebController.getAll.bind(PositionWebController)
);

routes.post(
  "/",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  PositionWebController.createPositions.bind(PositionWebController)
);

routes.delete(
  "/:position_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  PositionWebController.destroy.bind(PositionWebController)
);

export default routes;
