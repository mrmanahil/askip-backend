import * as express from 'express';
import mongoose from 'mongoose';
import {
  badRequestHandler,
  serverErrorHandler,
  successHandler,
} from '../../utils/responseHandler';
import { AppointmentRequestModel } from './model';

export const createAppointmentReport = async (req: express.Request, res: express.Response): Promise<void> => {
    // console.log('user', req.body.phone);
    try {
  
        let appointmentReportCreate = new AppointmentRequestModel()   
        appointmentReportCreate.talentId=req.body.talentId
        appointmentReportCreate.comment =req.body.comment
        // appointmentReportCreate.status =req.body.appointmentRequestCreate
        appointmentReportCreate = await  appointmentReportCreate.save()
       
        return successHandler(res, { appointmentReport: appointmentReportCreate }, 'AppointmentReport create sucessfully');
     
     
       } catch (err) {
         return serverErrorHandler(res, err);
       }
  };

  export const getAppointmentReportById = async (req: express.Request, res: express.Response): Promise<void> => {
    // console.log('user', req.body.phone);
    try {
  
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const findAppointment = await AppointmentRequestModel.find({ _id: req.params.id });
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


  export const updateAppointmentReportStatus = async (req: express.Request, res: express.Response): Promise<void> => {
    // console.log('user', req.body.phone);
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
            case 'draft': {
  
  
              if (findAppointment.status == 'draft') {
                badRequestHandler(res, `status already draft`);
  
                break;
              } else {
                const appointmentStatus = await AppointmentRequestModel.findOneAndUpdate(
                  { _id: req.params.id },
                  { $set: { status: 'draft' } },
                );
  
                successHandler(res, { data: appointmentStatus, success: true }, "Status updated successfully.");
                break;
              }
            }
  
  
            case 'finished': {
              // console.log('accepted',docs)
  
              if (findAppointment.status == 'finished') {
                badRequestHandler(res, `status already finished`);
  
                break;
              } else {
                const appointmentStatus = await AppointmentRequestModel.findOneAndUpdate(
                  { _id: req.params.id },
                  { $set: { status: 'finished' } },
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
  };


  