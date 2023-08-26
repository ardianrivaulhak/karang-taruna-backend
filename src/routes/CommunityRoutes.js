import { Router } from "express";
import CommunityController from "../controllers/CommunityController";
import VerifyToken from "../middlewares/VerifyToken";
import AuthValidation from "../validations/AuthValidation";

const routes = Router();

routes.get(
  "/notification",
  VerifyToken.handle,
  CommunityController.getCommunityNotification.bind(CommunityController)
);

routes.post(
  "/post",
  VerifyToken.handle,
  CommunityController.createPost.bind(CommunityController)
);

routes.get(
  "/post",
  VerifyToken.handle,
  CommunityController.getPosts.bind(CommunityController)
);

routes.get(
  "/post/:member_id",
  VerifyToken.handle,
  CommunityController.getPostsByMember.bind(CommunityController)
);

routes.post(
  "/comment/:post_id",
  VerifyToken.handle,
  CommunityController.commentingPost.bind(CommunityController)
);

routes.get(
  "/comment/:post_id",
  VerifyToken.handle,
  CommunityController.getCommentsPost.bind(CommunityController)
);

routes.post(
  "/like",
  VerifyToken.handle,
  CommunityController.likingPost.bind(CommunityController)
);

routes.post(
  "/like/:post_id/unlike",
  VerifyToken.handle,
  CommunityController.unLikingPost.bind(CommunityController)
);

routes.get(
  "/total-activity",
  VerifyToken.handle,
  CommunityController.getCountActivity.bind(CommunityController)
);

routes.get(
  "/me",
  VerifyToken.handle,
  CommunityController.getMe.bind(CommunityController)
);

routes.post(
  "/check-username",
  ...AuthValidation.checkUsername(),
  CommunityController.checkUsername.bind(CommunityController)
);

routes.post(
  "/update-username",
  ...AuthValidation.checkUsername(),
  VerifyToken.handle,
  CommunityController.updateUsername.bind(CommunityController)
);

export default routes;
