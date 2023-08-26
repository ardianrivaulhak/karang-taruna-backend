import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import SurveyController from "../controllers/SurveyController";

const routes = Router();

routes.post(
  "/",
  VerifyToken.handle,
  SurveyController.create.bind(SurveyController)
);

routes.get("/", SurveyController.findAll.bind(SurveyController));
routes.get("/:id", SurveyController.findById.bind(SurveyController));
routes.post("/:id", SurveyController.update.bind(SurveyController));
routes.delete("/:id", SurveyController.destroy.bind(SurveyController));
export default routes;
