import * as express from 'express';
import mongoose from 'mongoose';
import {
  badRequestHandler,
  serverErrorHandler,
  successHandler,
} from '../../utils/responseHandler';
import { AppointmentRequestModel } from './model';

export const createAppointmentRequest = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);
  try {

    let appointmentRequestCreate = new AppointmentRequestModel()
    appointmentRequestCreate.talentId = req.body.talentId
    appointmentRequestCreate.revelateurId = req.body.revelateurId
    // appointmentRequestCreate.status = req.body.status,
    appointmentRequestCreate = await appointmentRequestCreate.save()

    return successHandler(res, { appointmentReport: appointmentRequestCreate }, 'AppointmentReport create sucessfully');


  } catch (err) {
    return serverErrorHandler(res, err);
  }
};


export const getAppointmentRequestById = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);
  try {


    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAppointment = await AppointmentRequestModel.findById({ _id: req.params.id });
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



export const updateAppointmentRequestStatus = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log('user', req.body.phone);

  try {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const findAppointment = await AppointmentRequestModel.findById({ _id: req.params.id });
    if (findAppointment) {
      switch (req.body.status) {

        case 'pending': {


          if (findAppointment.status == 'pending') {
            badRequestHandler(res, `status already pending`);
            break;
          } else {
            const appointmentStatus = await AppointmentRequestModel.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { status: 'pending' } },
            );

            successHandler(res, { data: appointmentStatus, success: true }, "Status updated successfully.");
            break;
          }




        }
        case 'accepted': {


          if (findAppointment.status == 'accepted') {
            badRequestHandler(res, `status already accepted`);

            break;
          } else {
            const appointmentStatus = await AppointmentRequestModel.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { status: 'accepted' } },
            );

            successHandler(res, { data: appointmentStatus, success: true }, "Status updated successfully.");
            break;
          }
        }


        case 'refused': {
          // console.log('accepted',docs)

          if (findAppointment.status == 'refused') {
            badRequestHandler(res, `status already refused`);

            break;
          } else {
            const appointmentStatus = await AppointmentRequestModel.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { status: 'refused' } },
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
  }
  catch(err){
    return serverErrorHandler(res, err); 
  }


};

