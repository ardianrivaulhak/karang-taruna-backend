import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import PositionController from "../controllers/PositionController";
import VerifyRole from "../middlewares/VerifyRole";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  PositionController.createPosition.bind(PositionController)
);

routes.get("/", PositionController.findAll.bind(PositionController));
routes.get("/:id", PositionController.findById.bind(PositionController));
routes.post("/:id", PositionController.update.bind(PositionController));
routes.delete("/:id", PositionController.destroy.bind(PositionController));
export default routes;
