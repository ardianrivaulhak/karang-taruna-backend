import { Router } from "express";
import VerifyToken from "../middlewares/VerifyToken";
import JobController from "../controllers/JobController";

const routes = Router();

routes.post("/", VerifyToken.handle, JobController.create.bind(JobController));

routes.get("/", JobController.findAll.bind(JobController));
routes.get("/:id", JobController.findById.bind(JobController));
routes.post("/:id", JobController.update.bind(JobController));
routes.delete("/:id", JobController.destroy.bind(JobController));
export default routes;
