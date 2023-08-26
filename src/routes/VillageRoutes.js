import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import VillageController from "../controllers/VillageController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  VillageController.create.bind(VillageController)
);

routes.get("/", VillageController.findAll.bind(VillageController));
routes.get("/:id", VillageController.findById.bind(VillageController));
routes.post("/:id", VillageController.update.bind(VillageController));
routes.delete("/:id", VillageController.destroy.bind(VillageController));
export default routes;
