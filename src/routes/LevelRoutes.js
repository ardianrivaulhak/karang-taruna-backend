import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import LevelController from "../controllers/LevelController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  LevelController.create.bind(LevelController)
);

routes.get("/", LevelController.findAll.bind(LevelController));
routes.get("/:id", LevelController.findById.bind(LevelController));
routes.post("/:id", LevelController.update.bind(LevelController));
routes.delete("/:id", LevelController.destroy.bind(LevelController));
export default routes;
