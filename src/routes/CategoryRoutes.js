import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import VerifyToken from "../middlewares/VerifyToken";

const routes = Router();

routes.get(
  "/",
  VerifyToken.handle,
  CategoryController.getCategories.bind(CategoryController)
);
routes.post(
  "/",
  VerifyToken.handle,
  CategoryController.createCategory.bind(CategoryController)
);

routes.get(
  "/:category_id",
  VerifyToken.handle,
  CategoryController.detailCategory.bind(CategoryController)
);
routes.put(
  "/:category_id",
  VerifyToken.handle,
  CategoryController.updateCategory.bind(CategoryController)
);
routes.delete(
  "/:category_id",
  VerifyToken.handle,
  CategoryController.destroyCategory.bind(CategoryController)
);

export default routes;
