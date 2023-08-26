import { Router } from "express";
import RoleWebController from "../../controllers/Web/RoleWebController";
const routes = Router();

routes.get("/", RoleWebController.getRole.bind(RoleWebController));
routes.post("/", RoleWebController.createRole.bind(RoleWebController));

export default routes;
