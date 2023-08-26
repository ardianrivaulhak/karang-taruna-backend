import NewsController from "../controllers/NewsController";
import { Router } from "express";
import { uploadNews } from "../middlewares/FilePath";
import VerifiToken from "../middlewares/VerifyToken";
const routes = Router();

routes.post(
  "/",
  VerifiToken.handle,
  uploadNews.array("url", 10),
  NewsController.createNews.bind(NewsController)
);

routes.get("/", NewsController.getNews.bind(NewsController));

routes.get(
  "/saved",
  VerifiToken.handle,
  NewsController.getSavedNews.bind(NewsController)
);

routes.put(
  "/:news_id",
  VerifiToken.handle,
  uploadNews.array("url", 10),
  NewsController.updateNews.bind(NewsController)
);

routes.put(
  "/rejected/:news_id",
  VerifiToken.handle,
  uploadNews.array("url", 10),
  NewsController.updateEventRejected.bind(NewsController)
);

routes.get("/:news_id", NewsController.getDetail.bind(NewsController));

routes.post(
  "/save/:news_id",
  VerifiToken.handle,
  NewsController.saveNews.bind(NewsController)
);

routes.post(
  "/unsave/:news_id",
  VerifiToken.handle,
  NewsController.unSaveNews.bind(NewsController)
);
export default routes;
