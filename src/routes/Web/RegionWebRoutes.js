import { Router } from "express";
import RegionWebController from "../../controllers/Web/RegionWebController";
import VerifyToken from "../../middlewares/VerifyToken";
import VerifyRole from "../../middlewares/VerifyRole";

const routes = Router();

routes.get(
  "/:province_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  RegionWebController.getRegion.bind(RegionWebController)
);

routes.post(
  "/",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  RegionWebController.updateRegion.bind(RegionWebController)
);

routes.delete(
  "/:province_id/delete",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  RegionWebController.removeProvince.bind(RegionWebController)
);

routes.delete(
  "/:city_id/city/delete",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  RegionWebController.removeCity.bind(RegionWebController)
);

routes.delete(
  "/:district_id/district/delete",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  RegionWebController.removeDistrict.bind(RegionWebController)
);

routes.delete(
  "/:village_id/village/delete",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  RegionWebController.removeVillage.bind(RegionWebController)
);

export default routes;
