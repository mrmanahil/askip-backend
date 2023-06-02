import { Router } from "express";
// import { requireAdminAuth } from "../../utils/requireAuth";
import * as EventController from "./controller";


export const eventRoutes = Router();
eventRoutes.post(
  "/auth/createEvent",
  // requireAdminAuth,
  EventController.craeteEvent
);

eventRoutes.get(
  "/auth/getEvent/:id",
  EventController.getEvent
);

eventRoutes.get(
  "/auth/getEventsPerPage",
  EventController.getEventsPerPage
);
eventRoutes.get(
  "/auth/getEvents",
  EventController.getEvents
);



eventRoutes.delete(
  "/auth/deleteEvent/:id",
  EventController.deleteEvent
);
eventRoutes.put(
  "/auth/updateEvent/:id",
  EventController.updateEvent
);

eventRoutes.put(
  "/auth/subsribeEvent/:id",
  EventController.subscribeEvent
);
eventRoutes.put(
  "/auth/unSubscribeEvent/:id",
  EventController.unSubscribeEvent
);

eventRoutes.get(
  "/auth/getSubscribeEvents/:id",
  EventController.getSubsribeEvent
);


eventRoutes.put(
  "/auth/subsribeEventAdAndRev/:id",
  EventController.subscribeEventAdOrRev
);

eventRoutes.put(
  "/auth/unsubsribeEventAdAndRev/:id",
  EventController.unSubscribeEventAdOrRev
);
eventRoutes.get(
  "/auth/getSubsribeEventAdAndRev/:id",
  EventController.getSubsribeEventAdAndRev
);


eventRoutes.post(
  "/auth/getParticularEvent/:id",
  EventController.getSubsribeParticularEvent
);


eventRoutes.get(
  "/auth/getFinshedEvent/:id",
  EventController.getSubsribeParticularEventStatus
);

eventRoutes.get(
  "/auth/getUnsubscribeTalent/:id",
  EventController.getUnsubscribeTalent
);

eventRoutes.put(
  "/auth/eventsUpdate/:id",
  EventController.eventStatusUpdate
);

eventRoutes.get(
  "/auth/eventsUpdate/:id",
  EventController.getSubsribePastEvent
);