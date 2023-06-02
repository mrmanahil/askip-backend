/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import mongoose from 'mongoose';

import { serverErrorHandler, successHandler, badRequestHandler } from '../../utils/responseHandler';
import { AttendenceModel } from './model';

export const attendenceUpdate = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAttendenceSheet = await AttendenceModel.findOne({ eventId: req.params.id })
      if (!findAttendenceSheet) {
        return badRequestHandler(res, 'Attendence wer nbot found with that id');
      }
      else {
        switch (req.body.available) {
          case 'present': {

            const findSubscribeEventsPresent = await AttendenceModel.findOne(
              // subscriptionIds: [req.params.id],
              { present: { $in: [req.body.userId] } },
            )

            const findSubscribeEventsAbsent = await AttendenceModel.findOne(
              // subscriptionIds: [req.params.id],
              { absent: { $in: [req.body.userId] } },
            )


            console.log("present", findSubscribeEventsPresent)
            console.log("present", findSubscribeEventsAbsent)


            if (findSubscribeEventsPresent == null && findSubscribeEventsAbsent == null) {
              await AttendenceModel.updateOne(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    present: req.body.userId,
                  },
                },
              );
              return successHandler(res, findSubscribeEventsPresent, 'add to present list');
            }
            else if (findSubscribeEventsPresent && findSubscribeEventsAbsent == null) {
              return badRequestHandler(res, 'Already Present');
            }
            else if (findSubscribeEventsPresent == null && findSubscribeEventsAbsent) {
              console.log("found in a presernt")

              await AttendenceModel.updateOne(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    present: req.body.userId,
                  },
                  $pull: {
                    absent: req.body.userId,
                  },
                },
              );


              return successHandler(res, findSubscribeEventsPresent, 'add to absent list');
            }
            else {
              return badRequestHandler(res, 'Attendence wer nbot found with that id');
            }

            break;
          }
          case 'absent': {


            const findSubscribeEventsPresent = await AttendenceModel.findOne(
              // subscriptionIds: [req.params.id],
              { present: { $in: [req.body.userId] } },
            )

            const findSubscribeEventsAbsent = await AttendenceModel.findOne(
              // subscriptionIds: [req.params.id],
              { absent: { $in: [req.body.userId] } },
            )


            if (findSubscribeEventsPresent == null && findSubscribeEventsAbsent == null) {
              await AttendenceModel.updateOne(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    absent: req.body.userId,
                  },
                },
              );
              return successHandler(res, findSubscribeEventsAbsent, 'add absent list');

            }
            else if (findSubscribeEventsPresent == null && findSubscribeEventsAbsent) {
              return badRequestHandler(res, 'Alread absent');
            }
            else if (findSubscribeEventsPresent && findSubscribeEventsAbsent == null) {
              await AttendenceModel.updateOne(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    absent: req.body.userId,
                  },
                  $pull: {
                    present: req.body.userId,
                  },
                },
              );
              return successHandler(res, findSubscribeEventsAbsent, 'add absent list');
            }
            else {
              return badRequestHandler(res, 'Attendence wer nbot found with that id');
            }

            break;
          }

          default: {
            badRequestHandler(res, `Invalid Status`);
            break;
          }
        }
      }
    } else {
      return badRequestHandler(res, 'please provid valid id format');
    }
  }
  catch (err) {
    return serverErrorHandler(res, err);
  }
}


export const getAttendenceBYId = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAttendenceSheet = await AttendenceModel.findOne({ _id: req.params.id })
      console.log("findAttendenceSheet", findAttendenceSheet)
      if (findAttendenceSheet) {
        return successHandler(res, { Attendence: findAttendenceSheet }, 'Attenedence with that id');

      }

    } else {
      return badRequestHandler(res, 'Attendence wer nbot found with that id');
    }
  }
  catch (err) {
    return serverErrorHandler(res, err);
  }
}



export const getAttendenceAll = async (req: express.Request, res: express.Response): Promise<void> => {
  try {

    const findAttendenceSheet = await AttendenceModel.find()
    if (findAttendenceSheet) {
      return successHandler(res, findAttendenceSheet, 'Attendence list');

    }
    else {
      return badRequestHandler(res, 'Attendence were not found');
    }


  }
  catch (err) {
    return serverErrorHandler(res, err);
  }
}



export const updateAttendenceStatus = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAttendenceSheet = await AttendenceModel.findById({ _id: req.params.id })
      console.log("findAttendenceSheet",findAttendenceSheet)
      console.log("findAttendenceSheet", findAttendenceSheet)
      if (findAttendenceSheet) {
        // return successHandler(res, { Attendence: findAttendenceSheet }, 'Attenedence with that id');
        switch (req.body.status) {
          case 'open': {
            console.log('finished')

            if(findAttendenceSheet.status == 'open'){
              badRequestHandler(res, `status already opened`);
              break;
            }else{
              const attendenceData = await AttendenceModel.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { status: 'open' } },
              );
              successHandler(res, { data: attendenceData, success: true }, "Status updated successfully.");
              break;
            }
           

            
          
          }
          case 'closed': {
            if(findAttendenceSheet.status == 'closed'){
              badRequestHandler(res, `status already closed`);
              break;
            }else{
              const attendenceData = await AttendenceModel.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { status: 'closed' } },
              );
              successHandler(res, { data: attendenceData, success: true }, "Status updated successfully.");
              break;
            }
          }



          default: {
            badRequestHandler(res, `Invalid Status`);
            break;
          }
        }

      }

    } else {
      return badRequestHandler(res, 'Attendence wer nbot found with that id');
    }
  }
  catch (err) {
    return serverErrorHandler(res, err);
  }
}






// await EventModel.updateOne(
//   { _id: req.params.id },
//   {
//     $addToSet: {
//       subscriptionIds: req.body.userId,
//     },
//   },
// );



// await EventModel.updateOne(
//   { _id: req.params.id },
//   {
//     $pull: {
//       subscriptionIds: req.body.userId,
//     },
//   },
// );