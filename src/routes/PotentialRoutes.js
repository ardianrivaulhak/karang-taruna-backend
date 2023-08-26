import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import PotentialController from "../controllers/PotentialController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  PotentialController.create.bind(PotentialController)
);

routes.get("/", PotentialController.findAll.bind(PotentialController));
routes.get("/:id", PotentialController.findById.bind(PotentialController));
routes.post("/:id", PotentialController.update.bind(PotentialController));
routes.delete("/:id", PotentialController.destroy.bind(PotentialController));
export default routes;
