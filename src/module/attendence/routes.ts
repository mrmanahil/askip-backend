
import { Router } from "express";
import * as AttendenceController from "./controller"; 


export const attendenceRoutes = Router();


attendenceRoutes.put(
    "/attendence/:id",
    AttendenceController.attendenceUpdate
  );


  attendenceRoutes.get(
    "/attendence/get/:id",
    AttendenceController.getAttendenceBYId
  );


  attendenceRoutes.get(
    "/attendence",
    AttendenceController.getAttendenceAll
  );

  attendenceRoutes.put(
    "/attendenceStatusUpdate/:id",
    AttendenceController.updateAttendenceStatus
  );