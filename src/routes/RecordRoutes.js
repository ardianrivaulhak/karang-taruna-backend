import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import RecordController from "../controllers/RecordController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  RecordController.create.bind(RecordController)
);

routes.get("/", RecordController.findAll.bind(RecordController));
routes.get("/detail/by", RecordController.findByName.bind(RecordController));
routes.get("/:id", RecordController.findById.bind(RecordController));
routes.post("/:id", RecordController.update.bind(RecordController));
routes.delete("/:id", RecordController.destroy.bind(RecordController));
export default routes;
