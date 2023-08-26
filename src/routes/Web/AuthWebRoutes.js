import { Router } from "express";
import AuthWebController from "../../controllers/Web/AuthWebController";
import VerifyToken from "../../middlewares/VerifyToken";

const routes = Router();

routes.post("/login", AuthWebController.loginWeb.bind(AuthWebController));
routes.get("/me", VerifyToken.handle, AuthWebController.meWeb.bind(AuthWebController));

export default routes;
