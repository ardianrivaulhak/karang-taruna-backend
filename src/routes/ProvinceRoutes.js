import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import ProvinceController from "../controllers/ProvinceController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  ProvinceController.create.bind(ProvinceController)
);

routes.get("/", ProvinceController.findAll.bind(ProvinceController));
routes.get("/:id", ProvinceController.findById.bind(ProvinceController));
routes.post("/:id", ProvinceController.update.bind(ProvinceController));
routes.delete("/:id", ProvinceController.destroy.bind(ProvinceController));
export default routes;
