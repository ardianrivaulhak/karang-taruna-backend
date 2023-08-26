import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import RatingController from "../controllers/RatingController";

const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  RatingController.getAllRatingByMember.bind(RatingController)
);

export default routes;
