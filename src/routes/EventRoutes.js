import { Router } from "express";
import EventController from "../controllers/EventController";
import { uploadEvent } from "../middlewares/FilePath";
import VerifyToken from "../middlewares/VerifyToken";
const routes = Router();

routes.post(
  "/",
  uploadEvent.single("poster_url"),
  EventController.createEvent.bind(EventController)
);

routes.get("/", EventController.getEvent.bind(EventController));
routes.get("/:event_id", EventController.getDetail.bind(EventController));
routes.put(
  "/:event_id",
  VerifyToken.handle,
  uploadEvent.array("poster_url", 10),
  EventController.updateEvent.bind(EventController)
);

routes.put(
  "/rejected/:event_id",
  VerifyToken.handle,
  uploadEvent.array("poster_url", 10),
  EventController.updateEventRejected.bind(EventController)
);
routes.delete(
  "/:event_id",
  VerifyToken.handle,
  EventController.deleteEvent.bind(EventController)
);

export default routes;
