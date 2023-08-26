import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import BranchController from "../controllers/BranchController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  BranchController.create.bind(BranchController)
);

routes.get("/", BranchController.findAll.bind(BranchController));
routes.get("/:id", BranchController.findById.bind(BranchController));
routes.post("/:id", BranchController.update.bind(BranchController));
routes.delete("/:id", BranchController.destroy.bind(BranchController));
export default routes;
