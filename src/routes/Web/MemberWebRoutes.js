import { Router } from "express";
import MemberWebController from "../../controllers/Web/MemberWebController";
import VerifyRole from "../../middlewares/VerifyRole";
import VerifyToken from "../../middlewares/VerifyToken";
import { uploadPhotoProfile } from "../../middlewares/FilePath";

const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Admin,
  MemberWebController.getMember.bind(MemberWebController)
);

routes.get(
  "/:member_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  MemberWebController.findMe.bind(MemberWebController)
);
routes.put(
  "/:member_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  uploadPhotoProfile.single("photo"),
  MemberWebController.updateMe.bind(MemberWebController)
);
routes.delete(
  "/:member_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  MemberWebController.destroy.bind(MemberWebController)
);
routes.get(
  "/survey/:member_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  MemberWebController.findSurvey.bind(MemberWebController)
);
export default routes;
