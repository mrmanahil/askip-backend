import * as express from "express";
import {
  serverErrorHandler,
  successHandler,
  badRequestHandler,

} from "../../utils/responseHandler";
import { InvitationModel } from './model'
import { EventModel } from "../events/model";
import { UserModel } from "../userAuth";
import mongoose from "mongoose";

import { sendNotification } from '../../config/notifications'
// var admin = require("firebase-admin");



export const sendInvitation = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    console.log("REQ", req.body)
    const findEvents = await EventModel.findById({ _id: req.body.eventId });
    if (findEvents) {
      const findUser = await UserModel.find({ _id: { $in: req.body.userId } })
      if (findUser.length > 0) {
        const userIds = findUser.map(item => item.id)
        const revIds = findUser.map(item => item.relatedRevelateur)
        const userFcms = findUser.map(item => item.fcmToken)
        console.log("FCMS ", userFcms)
        if (req.body.role == 'Admin') {
          const findInvitation = await InvitationModel.findOne({ eventId: req.body.eventId, userId: req.body.userId })
          // const findInvitation = await InvitationModel.findOne({ $and: [{ eventId: req.body.eventId }, { userId: req.body.userId }] })
          if (findInvitation) {
            return badRequestHandler(res, "Invitation Already Sent!");
          }
          else {
            for (let i = 0; i < userIds.length; i++) {
              console.log(i)
              const createInvitation = new InvitationModel();
              createInvitation.userId = userIds[i];
              createInvitation.eventId = req.body.eventId;
              createInvitation.adminId = req.body.adminId;
              createInvitation.revelaturId = revIds[i];
              createInvitation.sendBy = req.body.sendBy;
              createInvitation.role = req.body.role;
              await createInvitation.save()
            }
            return successHandler(
              res,
              "Invitation Successfully created."
            );
          }
        }
        else if (req.body.role == 'revelateur') {
          const findInvitation = await InvitationModel.findOne({ eventId: req.body.eventId, userId: req.body.userId })
          // $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }]
          // { eventId: req.body.eventId },{ userId: req.body.userId }

          if (findInvitation) {
            return badRequestHandler(res, "Invitation Already Sent!");
          }
          else {
            const createInvitation = new InvitationModel();
            for (let i = 0; i < userIds.length; i++) {
              createInvitation.userId = userIds[i];
              createInvitation.eventId = req.body.eventId;
              createInvitation.adminId = req.body.adminId;
              createInvitation.revelaturId = revIds[i];
              createInvitation.sendBy = req.body.sendBy;
              createInvitation.role = req.body.role;
              await createInvitation.save()
            }
            return successHandler(
              res,
              { admin: createInvitation },
              "Invitation Sent Successfully!"
            );
          }
        }
        else {
          return badRequestHandler(res, "please define role");
        }
      }
      else {
        return badRequestHandler(res, "User not found");
      }
    }
    else {
      return badRequestHandler(res, "Event not found");
    }
  }

  catch (error) {
    return serverErrorHandler(res, error);
  }

}


export const updateStatusInvitation = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const findInvitation = await InvitationModel.findById(req.params.id)
    console.log('INVITATION', findInvitation)
    if (findInvitation) {
      // if (findInvitation.status == "pending") {
      //   const updateInvitation = await InvitationModel.findOneAndUpdate({
      //     $and: [{ eventId: req.body.eventId }, { userId: req.body.userId }]
      //   }
      //     ,
      //     {
      //       $set: {


      //         status: req.body.status,


      //       }
      //     })
      //   return successHandler(res, { data: updateInvitation, success: true }, "status already updated");
      // }
      // else {
      //   return badRequestHandler(res, `status alredy ${req.body.status}`);
      // }

      switch (req.body.status) {
        case 'declined': {
          console.log('HELLO Declined')
          const updateInvitation = await InvitationModel.findOneAndUpdate(
            {
              _id: req.params.id
            }
            ,
            {
              $set: {
                status: req.body.status,
              }
            }, { new: true })
          successHandler(res, { data: updateInvitation, success: true }, "Status updated successfully.");
          break;
        }
        case 'accepted': {
          const updateInvitation = await InvitationModel.findOneAndUpdate(
            {
              _id: req.params.id
            }
            ,
            {
              $set: {
                status: req.body.status,
              }
            }, { new: true })
          if (updateInvitation) {
            const findEventsId = await EventModel.findOne({
              $and: [{ _id: updateInvitation.eventId }, { subscriptionIds: { "$in": [updateInvitation.userId] } }],
            });
            if (!findEventsId) {
              await EventModel.updateOne(
                { _id: updateInvitation.eventId },
                {
                  $addToSet: {
                    subscriptionIds: updateInvitation.userId,
                  },
                }
              );
              return successHandler(
                res,
                findEventsId,
                "events subscribe sucessfully"
              );
            } else {
              return badRequestHandler(res, "already subscribed");
            }
          } else {
            return badRequestHandler(res, "Something wrong in invitation");
          }
          break;
        }

        default: {
          badRequestHandler(res, `Invalid Status`);
          break;
        }
      }

    } else {
      return badRequestHandler(res, 'Invitation not found.');
    }
  }
  catch (error) {
    return serverErrorHandler(res, error);
  }
}


export const getParticularInvitation = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  console.log("req.body", req.body)
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findInvitation = await InvitationModel.findById({ _id: req.params.id })
      if (!findInvitation) {
        return badRequestHandler(res, "invitation is not found with these credintials");
      } else {
        return successHandler(res, { Invitation: findInvitation }, "Invitation fetched successfully");
      }
    }
    else {
      return badRequestHandler(res, "invitation idformat is not correct");
    }


  }
  catch (error) {
    return serverErrorHandler(res, error);
  }
}



export const getAllInvitation = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const invitation = await InvitationModel.find()
    if (invitation) {
      return successHandler(res, { invitation: invitation }, "fetched invitation successfully");
    }
    else {
      return badRequestHandler(res, "invitation is not found");
    }


  }
  catch (err) {

    return serverErrorHandler(res, err);
  }
}



export const getAllInvitationByStatus = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const invitation = await InvitationModel.find({ status: req.query.status })
    if (invitation) {

      return successHandler(res, { invitation: invitation }, "fetched invitation successfully");
    }
    else {
      return badRequestHandler(res, "invitation is not found");
    }


  }
  catch (err) {

    return serverErrorHandler(res, err);
  }
}



export const sendNotifications = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const token = 'clRDWRuEQO6UmYGKfD4ddK:APA91bExpKuSNeA3OaSLwPIl3FAms6zXhzNTDhkJW_9YWrog1dL_qUeCUEDedf22eVwkCFss3rlQo7zFyB_9lLJWkykcbkJepPLswVhlZn2WHJMlkW3CxRmUEfHMrm_03cCdlQht1Cdt'
    const notification = sendNotification(token, '3232132', '4324324324324', { data: '5345345' })
    console.log("notification,notification", notification)
    notification.then(res => {
      console.log("res", res)

    })
      .catch(err => {
        console.log("error", err);

      })
    // return successHandler(
    //   res,
    //   notification,
    //   "Invitation Successfully created."
    // );

  }
  catch (err) {

    return serverErrorHandler(res, err);
  }
}



export const getAllInvitationById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const invitationCount = await InvitationModel.count({ userId: req.params.id, status: "pending" })
    const invitation = await InvitationModel.find({ userId: req.params.id })
      .populate(['userId', 'eventId', 'revelaturId', 'adminId'])
      // .sort({ createdAt: 'asc' });
      .sort({ createdAt: 'desc' });
    // .populate({ path: 'userId', select: ['firstName','lastName'] })
    // 'userId', 'eventId', 'revelaturId', 'adminId')
    if (invitation) {
      return successHandler(res, { invitationCount: invitationCount, invitation: invitation }, "fetched invitation successfully");
    }
    else {
      return badRequestHandler(res, "invitation is not found");
    }
  }
  catch (err) {
    return serverErrorHandler(res, err);
  }
}
