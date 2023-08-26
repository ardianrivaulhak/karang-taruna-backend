import { Router } from "express";
import KarangTarunaController from "../../controllers/Web/KarangTarunaController";
import VerifyRole from "../../middlewares/VerifyRole";
import VerifyToken from "../../middlewares/VerifyToken";
const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Admin,
  KarangTarunaController.getYouthOrganization.bind(KarangTarunaController)
);
routes.post(
  "/",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  KarangTarunaController.create.bind(KarangTarunaController)
);
routes.get(
  "/:branch_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  KarangTarunaController.detail.bind(KarangTarunaController)
);

routes.put(
  "/:branch_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  KarangTarunaController.update.bind(KarangTarunaController)
);
routes.delete(
  "/:branch_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  KarangTarunaController.destroy.bind(KarangTarunaController)
);

export default routes;
