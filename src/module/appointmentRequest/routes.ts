
import { Router } from "express";
import * as appointment from "./controller";

export const appointmentRequest = Router();


appointmentRequest.post(
    "/appointmentRequest",
    // validator(rules.register, ValidationSource.BODY),
    appointment.createAppointmentRequest
  );

  appointmentRequest.put(
    "/appointmentRequest/:id",
    // validator(rules.register, ValidationSource.BODY),
    appointment.updateAppointmentRequestStatus
  );

  // appointmentRequest.get(
  //   "/appointmentRequest/:id",
    
  //   appointment.getAppointmentRequestById
  // );

//   appointmentRequest.get(
//     "/appointmentByUser/:id",
//     // validator(rules.register, ValidationSource.BODY),
//     appointment.getAppointmentsByUserId
//   );



 
//   appointments.get(
//     "/kiff",
//     // validator(rules.register, ValidationSource.BODY),
//     KiffController.getKiff
//   );