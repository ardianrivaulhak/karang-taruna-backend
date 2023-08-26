import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
const routes = Router();
import VerifiToken from "../middlewares/VerifyToken";

routes.get(
  "/",
  VerifiToken.handle,
  NotificationController.getNotifNews.bind(NotificationController)
);

export default routes;
