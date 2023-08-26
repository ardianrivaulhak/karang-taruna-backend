import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import CityController from "../controllers/CityController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  CityController.create.bind(CityController)
);

routes.get("/", CityController.findAll.bind(CityController));
routes.get("/:id", CityController.findById.bind(CityController));
routes.post("/:id", CityController.update.bind(CityController));
routes.delete("/:id", CityController.destroy.bind(CityController));
export default routes;
