import * as express from 'express';
import mongoose from 'mongoose';
import {
  badRequestHandler,
  serverErrorHandler,
  successHandler,
} from '../../utils/responseHandler';
import { AppointmentModel } from './model';



export const createAppointment = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);
  try {
    let createAppointment = new AppointmentModel()
    createAppointment.talent = req.body.talent
    createAppointment.createdBy = req.body.createdBy
    createAppointment.subject = req.body.subject
    createAppointment.time = req.body.time,
      createAppointment.date = req.body.date,
      createAppointment.type = req.body.type,
      createAppointment.onlineLink = req.body.onlineLink,
      createAppointment.postalAddress = req.body.postalAddress,
      createAppointment.zipCode = req.body.zipCode,
      createAppointment.city = req.body.city,
      createAppointment.additionallnfos = req.body.additionallnfos,
      createAppointment.attendancy = req.body.attendancy,
      createAppointment.appointmentReportId = req.body.appointmentReportId,
      createAppointment.appointmentCancelId = req.body.appointmentCancelId
    createAppointment = await createAppointment.save()
    return successHandler(res, { appointment: createAppointment }, 'Appointment create sucessfully');
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};


export const updateAppointmentStatus = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);
  try {

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAppointment = await AppointmentModel.findById({ _id: req.params.id });
      if (findAppointment) {
        switch (req.body.status) {

          case 'pending': {


            if (findAppointment.status == 'pending') {
              badRequestHandler(res, `status already pending`);
              break;
            } else {
              const appointmentStatus = await AppointmentModel.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { status: 'pending' } },
              );

              successHandler(res, { data: appointmentStatus, success: true }, "Status updated successfully.");
              break;
            }




          }
          case 'cancelled': {


            if (findAppointment.status == 'cancelled') {
              badRequestHandler(res, `status already cancelled`);

              break;
            } else {
              const appointmentStatus = await AppointmentModel.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { status: 'cancelled' } },
              );

              successHandler(res, { data: appointmentStatus, success: true }, "Status updated successfully.");
              break;
            }
          }


          case 'accepted': {
            // console.log('accepted',docs)

            if (findAppointment.status == 'accepted') {
              badRequestHandler(res, `status already accepted`);

              break;
            } else {
              const appointmentStatus = await AppointmentModel.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { status: 'accepted' } },
              );

              successHandler(res, { data: appointmentStatus, success: true }, "Status updated successfully.");
              break;
            }
          }


          default: {
            badRequestHandler(res, `Invalid Status`);
            break;
          }
        }
      }
      else {
        return badRequestHandler(res, `bad request error`);
      }

    }
    else {
      return badRequestHandler(res, `id format is not supported`);
    }



  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getAppointmentsByUserId = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);
  try {

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAppointment = await AppointmentModel.find({ talent: req.params.id });
      if (findAppointment) {
        return successHandler(res, findAppointment, "Status updated successfully.");
      }
      else {
        badRequestHandler(res, `bad request error`);
      }

    }
    else {
      badRequestHandler(res, `id format is not supported`);
    }



  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getAppointmentById = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);
  try {

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAppointment = await AppointmentModel.findById({ _id: req.params.id });
      if (findAppointment) {
        return successHandler(res, { data: findAppointment, success: true }, "Status updated successfully.");
      }
      else {
        return badRequestHandler(res, `bad request error`);
      }

    }
    else {
      return badRequestHandler(res, `id format is not supported`);
    }



  } catch (err) {
    return serverErrorHandler(res, err);
  }
}




