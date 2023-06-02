
import { Router } from "express";
import * as appointment from "./controller";

export const appointments = Router();


appointments.post(
    "/appointment",
    // validator(rules.register, ValidationSource.BODY),
    appointment.createAppointment
  );

  appointments.put(
    "/appointment/:id",
    // validator(rules.register, ValidationSource.BODY),
    appointment.updateAppointmentStatus
  );

  // appointments.get(
  //   "/appointment/:id",
  
  //   appointment.getAppointmentById
  // );

  // appointments.get(
  //   "/appointmentByUser/:id",

  //   appointment.getAppointmentsByUserId
  // );



 
//   appointments.get(
//     "/kiff",
//     // validator(rules.register, ValidationSource.BODY),
//     KiffController.getKiff
//   );