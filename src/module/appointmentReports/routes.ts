
import { Router } from "express";
import * as appointment from "./controller";

export const appointmentReport = Router();


appointmentReport.post(
    "/appointmentReports",
    // validator(rules.register, ValidationSource.BODY),
    appointment.createAppointmentReport
  );

  appointmentReport.put(
    "/appointmentReports/:id",
    // validator(rules.register, ValidationSource.BODY),
    appointment.updateAppointmentReportStatus
  );

  // appointmentReport.get(
  //   "//appointmentReports/:id",
 
  //   appointment.getAppointmentReportById
  // );

