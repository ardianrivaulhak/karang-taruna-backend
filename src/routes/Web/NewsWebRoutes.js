import { Router } from "express";
import NewsWebController from "../../controllers/Web/NewsWebController";
import VerifyRole from "../../middlewares/VerifyRole";
import VerifyToken from "../../middlewares/VerifyToken";
const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  VerifyRole.Admin,
  NewsWebController.getNews.bind(NewsWebController)
);
routes.get(
  "/:news_id",
  VerifyToken.handle,
  VerifyRole.Admin,
  NewsWebController.getDetail.bind(NewsWebController)
);
routes.put(
  "/:news_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  NewsWebController.newsUpdateStatus.bind(NewsWebController)
);
routes.delete(
  "/:news_id",
  VerifyToken.handle,
  VerifyRole.Super_Admin,
  NewsWebController.destroyNewsApproved.bind(NewsWebController)
);

export default routes;
