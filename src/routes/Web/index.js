import { Router } from "express";
const routes = Router();

// Web Routes
import EvenWebRoutes from "./EventWebRoutes";
import NewsWebRoutes from "./NewsWebRoutes";
import UserWebRoutes from "./UserWebRoutes";
import AuthWebRoutes from "./AuthWebRoutes";
import RoleWebRoutes from "./RoleWebRoutes";
import MemberWebRoutes from "./MemberWebRoutes";
import LeaderBoardRoutes from "./LearderBoardRoutes";
import RegionWebRoutes from "./RegionWebRoutes";
import KarangTarunaWebRoutes from "./KarangTarunaWebRoutes";
import DashboardWebRoutes from "./DashboardWebRoutes";

import PositionWebRoutes from "./PositionWebRoutes";
// Web Routes
routes.use("/event", EvenWebRoutes);
routes.use("/news", NewsWebRoutes);
routes.use("/user", UserWebRoutes);
routes.use("/auth", AuthWebRoutes);
routes.use("/role", RoleWebRoutes);
routes.use("/member", MemberWebRoutes);
routes.use("/leaderboard", LeaderBoardRoutes);
routes.use("/region", RegionWebRoutes);
routes.use("/taruna", KarangTarunaWebRoutes);
routes.use("/dashboard", DashboardWebRoutes);
routes.use("/position", PositionWebRoutes);
export default routes;
