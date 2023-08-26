import { Router } from "express";
import EvenWebController from "../../controllers/Web/EventWebController";
import VerifyRole from "../../middlewares/VerifyRole";
import VerifyToken from "../../middlewares/VerifyToken";
const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Admin,

  EvenWebController.getEvent.bind(EvenWebController)
);

routes.get(
  "/:event_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  EvenWebController.getDetail.bind(EvenWebController)
);
routes.put(
  "/:event_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  EvenWebController.eventUpdateStatus.bind(EvenWebController)
);
routes.delete(
  "/:event_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  EvenWebController.destroyEventApproved.bind(EvenWebController)
);

export default routes;
