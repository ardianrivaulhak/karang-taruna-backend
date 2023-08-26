import { Router } from "express";
import VersionController from "../controllers/VersionController";
import RateLimiter from "../middlewares/RateLimiter";
import AuthRoutes from "./AuthRoutes";
import EventRoutes from "./EventRoutes";
import NewRoutes from "./NewRoutes";
import CommunityRoutes from "./CommunityRoutes";
import RecordRoutes from "./RecordRoutes";
import MemberRoutes from "./MemberRoutes";
import BranchRoutes from "./BranchRoutes";
import JobRoutes from "./JobRoutes";
import RatingRoutes from "./RatingRoutes";
import LevelRoutes from "./LevelRoutes";
import PositionLevel from "./PositionRoutes";
import NotifRoutes from "./NotificationRoutes";
import ProvinceRoutes from "./ProvinceRoutes";
import CityRoutes from "./CityRoutes";
import DistrictRoutes from "./DistrictRoutes";
import VillageRoutes from "./VillageRoutes";
import CategoryRoutes from "./CategoryRoutes";
import PotentialRoutes from "./PotentialRoutes";
import SurveyRoutes from "./SurveyRoutes";
import WebRoutes from "./Web";
import CronJobRoutes from "./jobs";

const routes = Router();

routes.get(
  "/health-check",
  RateLimiter.handle(10),
  VersionController.check.bind(VersionController)
);

routes.get(
  "/version",
  RateLimiter.handle(10),
  VersionController.lastest.bind(VersionController)
);

routes.use("/cronjob", CronJobRoutes);
routes.use("/auth", AuthRoutes);
routes.use("/event", EventRoutes);
routes.use("/news", NewRoutes);
routes.use("/community", CommunityRoutes);
routes.use("/record", RecordRoutes);
routes.use("/member", MemberRoutes);
routes.use("/branch", BranchRoutes);
routes.use("/job", JobRoutes);
routes.use("/level", LevelRoutes);
routes.use("/position", PositionLevel);
routes.use("/notification", NotifRoutes);
routes.use("/province", ProvinceRoutes);
routes.use("/city", CityRoutes);
routes.use("/district", DistrictRoutes);
routes.use("/village", VillageRoutes);
routes.use("/category", CategoryRoutes);
routes.use("/potential", PotentialRoutes);
routes.use("/survey", SurveyRoutes);
routes.use("/rating", RatingRoutes);

routes.use("/web", WebRoutes);
export default routes;
