import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AuthValidation from "../validations/AuthValidation";
import VerifyToken from "../middlewares/VerifyToken";

const routes = Router();

routes.post(
  "/register",
  ...AuthValidation.register(),
  AuthController.register.bind(AuthController)
);
routes.post("/login", AuthController.login.bind(AuthController));
routes.get("/me", VerifyToken.handle, AuthController.me.bind(AuthController));
routes.post(
  "/otp-validation",
  AuthController.otpValidation.bind(AuthController)
);
routes.post(
  "/update-fcm",
  VerifyToken.handle,
  AuthController.updateFcm.bind(AuthController)
);

export default routes;
