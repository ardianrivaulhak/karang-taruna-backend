import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import DistrictController from "../controllers/DistrictController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  DistrictController.create.bind(DistrictController)
);

routes.get("/", DistrictController.findAll.bind(DistrictController));
routes.get("/:id", DistrictController.findById.bind(DistrictController));
routes.post("/:id", DistrictController.update.bind(DistrictController));
routes.delete("/:id", DistrictController.destroy.bind(DistrictController));
export default routes;
