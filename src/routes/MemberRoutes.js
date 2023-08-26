import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import MemberController from "../controllers/MemberController";
import { uploadPhotoProfile } from "../middlewares/FilePath";

const routes = Router();

routes.get("/", MemberController.findAll.bind(MemberController));
routes.get(
  "/me",
  VerifyToken.handle,
  MemberController.findMe.bind(MemberController)
);
routes.put(
  "/me",
  uploadPhotoProfile.single("photo"),
  VerifyToken.handle,
  MemberController.updateMe.bind(MemberController)
);

export default routes;
