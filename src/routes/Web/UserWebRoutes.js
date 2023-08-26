import UserWebController from "../../controllers/Web/UserWebController";
import { Router } from "express";
import VerifyToken from "../../middlewares/VerifyToken";
import VerifyRole from "../../middlewares/VerifyRole";
const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Admin,
  UserWebController.getUser.bind(UserWebController)
);
routes.get(
  "/:user_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  UserWebController.detailUser.bind(UserWebController)
);
routes.post(
  "/",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  UserWebController.createUser.bind(UserWebController)
);

routes.put(
  "/status/:user_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  UserWebController.updateStatus.bind(UserWebController)
);

routes.put(
  "/:user_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  UserWebController.updateUser.bind(UserWebController)
);
routes.delete(
  "/:user_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  UserWebController.destroyUser.bind(UserWebController)
);

export default routes;
