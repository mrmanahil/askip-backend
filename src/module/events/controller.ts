/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';

import { serverErrorHandler, successHandler, badRequestHandler } from '../../utils/responseHandler';
// import Admin from "../adminAuth/model";

import { EventModel } from './model';

import { UserModel } from '../userAuth/model';

import { AttendenceModel } from '../attendence/model';


import mongoose from 'mongoose';

export const craeteEvent = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('req.user', req.user);
  try {
    const userData = req.user;
    let createEvent = new EventModel();
    (createEvent.eventName = req.body.eventName),
      (createEvent.postalAddress = req.body.postalAddress),
      (createEvent.eventImage = req.body.eventImage),
      (createEvent.zipCode = req.body.zipCode),
      (createEvent.description = req.body.description),
      (createEvent.beginAt = req.body.beginAt),
      (createEvent.endAt = req.body.endAt),
      (createEvent.startTime = req.body.startTime),
      (createEvent.endTime = req.body.endTime),
      (createEvent.status = req.body.status),
      //     mandatoryRegistrationOnline:boolean,
      // mandatoryRegistrationOnSite:boolean,
      (createEvent.mandatoryRegistrationOnline = req.body.mandatoryRegistrationOnline),
      (createEvent.mandatoryRegistrationOnSite = req.body.mandatoryRegistrationOnSite),
      // (createEvent.mandatoryRegistration = req.body.mandatoryRegistration),
      (createEvent.participationType = req.body.participationType),
      (createEvent.minNumberParticipantsOnSite = req.body.minNumberParticipantsOnSite),
      (createEvent.maxNumberParticipantsOnSite = req.body.maxNumberParticipantsOnSite),
      (createEvent.minNumberParticipantsOnline = req.body.minNumberParticipantsOnline),
      (createEvent.maxNumberParticipantsOnline = req.body.maxNumberParticipantsOnline),
      (createEvent.numberOfRevelateurs = req.body.numberOfRevelateurs),
      (createEvent.choicePlatfrom = req.body.choicePlatfrom),
      (createEvent.price = req.body.price),
      (createEvent.category = req.body.category),
      (createEvent.organizerId = req.body.organizerId),
      (createEvent.organizerBy = req.body.organizerBy),
      (createEvent.role = req.body.role),
      (createEvent.subsIdAdminAndRevelature = req.body.s_id),
      (createEvent.isPublished = req.body.isPublished),
      (createEvent.city = req.body.city),
      // (createEvent = await createEvent.save())
      console.log('createEvent', createEvent);
    const craeteInvitation = new AttendenceModel();
    craeteInvitation.eventId = createEvent.id;
    createEvent.eventIdAttence = createEvent.id;
    createEvent = await createEvent.save();
    await craeteInvitation.save();
    return successHandler(res, userData, 'event is created');
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getEvent = async (req: express.Request, res: express.Response): Promise<void> => {
  //  let createEvent = new EventModel()
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const getEvent = await EventModel.findById(req.params.id).populate({
        path: 'subsIdAdminAndRevelature',
        select: ['firstName', 'lastName'],
      });

      if (!getEvent) {
        return badRequestHandler(res, 'events not found');
      } else {
        return successHandler(res, getEvent, 'event is sucessfully fetched');
      }
    } else {
      return badRequestHandler(res, 'please provid valid id format');
    }
    // return successHandler(res, createEvent , "event is created");
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getEvents = async (req: express.Request, res: express.Response): Promise<void> => {
  //  let createEvent = new EventModel()
  try {
    const getEvents = await EventModel.find(
      { status: req.query.status },
      { subsribtionMinor: 0 },
    ).populate({
      path: 'subsIdAdminAndRevelature',
      select: ['firstName', 'lastName'],
    });
    console.log("get events",getEvents)
    if (!getEvents) {
      return badRequestHandler(res, 'events not found');
    } else {
      return successHandler(res, getEvents, 'events is sucessfully fetched');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getEventsPerPage = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  //  let createEvent = new EventModel()

  try {
    let filterr = {};
    let dateSort: any = 1;
    if (req.query.status) {
      filterr = { status: { $in: req.query.status } };
      // console.log("req.query",filterr)
    }
    if (req.query.kiffs) {
      // console.log("req.query", req.query.kiffs)
      filterr = { category: { $in: req.query.kiffs }, ...filterr };
    }
    if (req.query.city) {
      // console.log("req.query", req.query.city)
      filterr = { city: { $in: req.query.city }, ...filterr };
    }
    if (req.query.sort) {
      if (req.query.sort == "as") {
        dateSort = 1
      }
      else if (req.query.sort = "ds") {
        dateSort = -1
      }
      else {
        dateSort = 1
      }
    }
    console.log('filterr', filterr);
    // console.log("req.query", req.query.status)
    const page: any = req.query.page;
    const lim: any = req.query.limit || 10;
    const skip = (page - 1) * lim;
    // const getEvents = await EventModel.find({ status: { $in: req.query.status } })
    console.log("req.query.sort", req.query.sort)
    console.log("sorrrrt", dateSort)
    const getEvents = await EventModel.find(filterr, { subsribtionMinor: 0 }).skip(skip).limit(lim).sort({ beginAt: dateSort });
    // .populate({
    //   path: 'subsIdAdminAndRevelature',
    //   select: ['firstName', 'lastName'],
    // });
    console.log('Events', getEvents.length);
    const getEventsCounts = await EventModel.count(filterr);
    if (!getEvents) {
      return badRequestHandler(res, 'events not found');
    } else {
      return successHandler(
        res,
        { getEvents, counts: getEventsCounts },
        'events is sucessfully fetched',
      );
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const deleteEvent = async (req: express.Request, res: express.Response): Promise<void> => {
  //  let createEvent = new EventModel()
  const deleteEvents = await EventModel.findOne({ _id: req.params.id });
  try {
    if (!deleteEvents) {
      return badRequestHandler(res, 'events not found');
    } else {
      const deleteOneEvent = await EventModel.deleteOne({ _id: req.params.id });
      return successHandler(res, deleteOneEvent, 'event is deleted sucessfully');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const updateEvent = async (req: express.Request, res: express.Response): Promise<void> => {
  //  let createEvent = new EventModel()
  console.log('user', req.body);
  console.log('user', req.body);
  const findEvent = await EventModel.findById(req.params.id);
  console.log('findEvent', findEvent);
  try {
    if (findEvent) {
      // const password = hashPassword(req.body.password, "10")
      const data = await EventModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            eventName: req.body.eventName,
            eventImage: req.body.eventImage,
            postalAddress: req.body.postalAddress,
            zipCode: req.body.zipCode,
            description: req.body.description,
            beginAt: req.body.beginAt,
            endAt: req.body.endAt,
            startTime: req.body.startTime,
            endTime: req.body.endTimel,
            mandatoryRegistration: req.body.mandatoryRegistration,
            participationType: req.body.participationType,
            minNumberParticipants: req.body.minNumberParticipants,
            maxNumberParticipants: req.body.maxNumberParticipants,
            numberOfRevelateurs: req.body.numberOfRevelateurs,
            choicePlatfrom: req.body.choicePlatfrom,
            price: req.body.price,
            status: req.body.status,
            mandatoryRegistrationOnline: req.body.mandatoryRegistrationOnline,
            mandatoryRegistrationOnSite: req.body.mandatoryRegistrationOnSite,
            category: req.body.category,
          },
        },
        { new: true },
      );
      return successHandler(res, data, 'update evnts sucessfully');
    } else {
      return badRequestHandler(res, 'events error');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

// export const subscribeEvent = async (
//   req: express.Request,
//   res: express.Response
// ): Promise<void> => {
//   const findEvents = await EventModel.findOne({ _id: req.params.id });
//   console.log("", findEvents);
//   try {
//     // console.log("findEvents",findEvents)
//     if (!findEvents) {
//       return badRequestHandler(res, "events not found");
//     } else {
//       // {$and: [{location : {$in: ids}},{date}]})
//       const findEventsId = await EventModel.findOne({
//         $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//       });
//       // await EventModel.findOneAndUpdate({},)
//       console.log("findEventsId", findEventsId);

//       if (!findEventsId) {
//         await EventModel.updateOne(
//           { _id: req.params.id },
//           {
//             $addToSet: {
//               subscriptionIds: req.body.userId,
//             },
//           }
//         );
//         return successHandler(
//           res,
//           findEventsId,
//           "events subscribe sucessfully"
//         );
//       } else if (findEventsId) {
//         return badRequestHandler(res, "already subscribed");
//       } else {
//         return badRequestHandler(res, "error");
//       }
//     }
//   } catch (err) {
//     return serverErrorHandler(res, err);
//   }
// };

// export const subscribeEvent = async (
//   req: express.Request,
//   res: express.Response
// ): Promise<void> => {
//   const findEvents = await EventModel.findOne({ _id: req.params.id });
//   console.log("", findEvents);
//   try {
//     if(req.body.role == 'Admin' || req.body.role == 'Revelature')
//     {
//       if (!findEvents) {
//         return badRequestHandler(res, "events not found");
//       } else {
//         // {$and: [{location : {$in: ids}},{date}]})
//         const findEventsId = await EventModel.findOne({
//           $and: [{ _id: req.params.id }, { subsIdAdminAndRevelature: req.body.userId }],
//         });
//         await EventModel.findOneAndUpdate({},)
//         console.log("findEventsId", findEventsId);

//         if (!findEventsId) {
//           await EventModel.updateOne(
//             { _id: req.params.id },
//             {
//               $addToSet: {
//                 subsIdAdminAndRevelature: req.body.userId,
//               },
//             }
//           );
//           return successHandler(
//             res,
//             findEventsId,
//             "events subscribe sucessfully"
//           );
//         } else if (findEventsId) {
//           return badRequestHandler(res, "already subscribed");
//         } else {
//           return badRequestHandler(res, "error");
//         }
//       }
//     }
//     else{
//       if (!findEvents) {
//         return badRequestHandler(res, "events not found");
//       } else {
//         // {$and: [{location : {$in: ids}},{date}]})
//         const findEventsId = await EventModel.findOne({
//           $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//         });
//         await EventModel.findOneAndUpdate({},)
//         console.log("findEventsId", findEventsId);

//         if (!findEventsId) {
//           await EventModel.updateOne(
//             { _id: req.params.id },
//             {
//               $addToSet: {
//                 subscriptionIds: req.body.userId,
//               },
//             }
//           );
//           return successHandler(
//             res,
//             findEventsId,
//             "events subscribe sucessfully"
//           );
//         } else if (findEventsId) {
//           return badRequestHandler(res, "already subscribed");
//         } else {
//           return badRequestHandler(res, "error");
//         }
//       }
//     }
//     // console.log("findEvents",findEvents)

//   } catch (err) {
//     return serverErrorHandler(res, err);
//   }
// };

export const unSubscribeEvent = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const findEvents = await EventModel.findOne({ _id: req.params.id });
  console.log('', findEvents);
  try {
    // console.log("findEvents",findEvents)
    if (!findEvents) {
      return badRequestHandler(res, 'events not found');
    } else {
      // {$and: [{location : {$in: ids}},{date}]})
      const findEventsId = await EventModel.findOne({
        $and: [{ _id: req.params.id }, { subscriptionIds: { $in: [req.body.userId] } }],
      });
      console.log('findEventsId', findEventsId);

      if (findEventsId) {
        await EventModel.updateOne(
          { _id: req.params.id },
          {
            $pull: {
              subscriptionIds: req.body.userId,
            },
          },
        );

        await AttendenceModel.findOneAndUpdate(
          { eventId: req.params.id },
          {
            $pull: {
              present: req.body.userId,
            },
          },
        );
        return successHandler(res, findEventsId, ' events unsubscribe sucessfully');
      } else {
        return badRequestHandler(
          res,
          'user id not found for unsubsribe event first subsribe then unsubsribe',
        );
      }
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getSubsribeEvent = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    console.log('req.params.id', req.params.id);
    const findSubscribeEvents = await EventModel.find(
      // subscriptionIds: [req.params.id],
      { subscriptionIds: { $in: [req.params.id] } },
    ).populate({
      path: 'subsIdAdminAndRevelature',
      select: ['firstName', 'lastName'],
    });

    // "eventName": null,
    // "eventImage": null,
    // "postalAddress
    console.log('findSubscribeEvents', findSubscribeEvents);
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      if (findSubscribeEvents.length < 0) {
        return badRequestHandler(res, 'events with that is not found');
      } else {
        return successHandler(res, findSubscribeEvents, 'fetched subsribe event with that id');
      }
    } else {
      return badRequestHandler(res, 'id format is not correct');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const subscribeEventAdOrRev = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  // console.log("", findEvents);
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findEvents = await EventModel.findOne({ _id: req.params.id });
      // console.log("findEvents",findEvents)
      if (!findEvents) {
        return badRequestHandler(res, 'events not found');
      } else {
        // {$and: [{location : {$in: ids}},{date}]})
        const findEventsId = await EventModel.findOne({
          $and: [{ _id: req.params.id }, { subsIdAdminAndRevelature: { $in: [req.body.userId] } }],
        });
        await EventModel.findOneAndUpdate({});
        console.log('findEventsId', findEventsId);

        if (!findEventsId) {
          await EventModel.updateOne(
            { _id: req.params.id },
            {
              $addToSet: {
                subsIdAdminAndRevelature: req.body.userId,
              },
            },
          );
          return successHandler(res, findEventsId, 'events subscribe sucessfully');
        } else if (findEventsId) {
          return badRequestHandler(res, 'already subscribed');
        } else {
          return badRequestHandler(res, 'error');
        }
      }
    } else {
      return badRequestHandler(res, 'please provid valid id format');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const unSubscribeEventAdOrRev = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findEvents = await EventModel.findOne({ _id: req.params.id });
      console.log('', findEvents);
      if (!findEvents) {
        return badRequestHandler(res, 'events not found');
      } else {
        // {$and: [{location : {$in: ids}},{date}]})
        const findEventsId = await EventModel.findOne({
          $and: [{ _id: req.params.id }, { subsIdAdminAndRevelature: { $in: [req.body.userId] } }],

          // { subsIdAdminAndRevelature: [req.body.userId] }
        });
        console.log('findEventsId', findEventsId);

        if (findEventsId) {
          await EventModel.updateOne(
            { _id: req.params.id },
            {
              $pull: {
                subsIdAdminAndRevelature: req.body.userId,
              },
            },
          );
          return successHandler(res, findEventsId, ' events unsubscribe sucessfully');
        } else {
          return badRequestHandler(
            res,
            ' id not found for unsubsribe event first subsribe then unsubsribe',
          );
        }
      }
    } else {
      return badRequestHandler(res, 'please provid valid id format');
    }
    // console.log("findEvents",findEvents)
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getSubsribeEventAdOrRev = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('req.params.id', req.params.id);
  const findSubscribeEvents = await EventModel.find(
    // subscriptionIds: [req.params.id],
    { subsIdAdminAndRevelature: { $in: [req.params.id] } },
  ).select(['eventName', 'eventImage', 'postalAddress']);

  // "eventName": null,
  // "eventImage": null,
  // "postalAddress
  console.log('findSubscribeEvents', findSubscribeEvents);
  try {
    if (findSubscribeEvents.length < 0) {
      return badRequestHandler(res, 'events with that is not found');
    } else {
      return successHandler(res, findSubscribeEvents, 'fetched subsribe event with that id');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getSubsribeEventAdAndRev = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('req.params.id', req.params.id);
  const findSubscribeEvents = await EventModel.find(
    // subscriptionIds: [req.params.id],
    { subsIdAdminAndRevelature: { $in: [req.params.id] } },
  ).select(['eventName', 'eventImage', 'postalAddress']);

  // "eventName": null,
  // "eventImage": null,
  // "postalAddress
  console.log('findSubscribeEvents', findSubscribeEvents);
  try {
    if (findSubscribeEvents.length < 0) {
      return badRequestHandler(res, 'events with that is not found');
    } else {
      return successHandler(res, findSubscribeEvents, 'fetched subsribe event with that id');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const subscribeEvent = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const SecondsInAMinute = 60;
    const findEvents = await EventModel.findOne({ _id: req.params.id });
    const findAttendenceByEventId = await AttendenceModel.findOne({ eventId: req.params.id })
    console.log("findAttendenceByEventId", findAttendenceByEventId)

    if (!findEvents) {
      return badRequestHandler(res, 'Event not found');
    }
    const findUser = await UserModel.findById(req.body.userId);
    if (!findUser) {
      return badRequestHandler(res, 'User not found');
    }
    if (!findAttendenceByEventId) {
      return badRequestHandler(res, 'attendece sheet not found');
    }

    else {
      console.log('User', findUser);
      if (findUser.relatedRevelateur != null) {
        if (findUser.birthDate != null) {
          const dateNow = new Date().getTime();
          const dateOfBirth = new Date(findUser.birthDate).getTime();
          const timeRem = dateNow - dateOfBirth;
          const daysToDday = Math.floor(
            timeRem / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
          );
          const years = Math.floor(daysToDday / 365);
          if (years < 18) {
            await UserModel.findByIdAndUpdate(
              { _id: findUser.id },
              { $set: { isApproved: false } },
              { new: true },
            );
            //  await AttendenceModel.findByIdAndUpdate(
            //   { eventId: req.params.id },
            //   {
            //     $addToSet: {
            //       present: req.body.userId,
            //     },
            //   },
            // );
            //TODO: ADD DATA in array of not approved
            const findEventIdMinor = await EventModel.findOne({
              $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
            });
            if (!findEventIdMinor) {
              await EventModel.updateOne(
                { _id: req.params.id },
                {
                  $addToSet: {
                    subscriptionIds: req.body.userId,
                  },
                },
              );

              await AttendenceModel.findOneAndUpdate(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    present: req.body.userId,
                  },
                },
              );
              return successHandler(
                res,
                findEventIdMinor,
                'subsribed successfully is less  than 18 revelutuer will allow you.',
              );
            } else {
              return badRequestHandler(res, 'Already Subscribed');
            }

            return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
          } else {
            const findEventsId = await EventModel.findOne({
              $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
            });
            if (!findEventsId) {
              await EventModel.updateOne(
                { _id: req.params.id },
                {
                  $addToSet: {
                    subscriptionIds: req.body.userId,
                  },
                },
              );

              await AttendenceModel.findOneAndUpdate(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    present: req.body.userId,
                  },
                },
              );
              return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
            } else {
              return badRequestHandler(res, 'Already Subscribed');
            }
          }
        } else {
          return badRequestHandler(res, 'Please update your profile');
        }
      } else {
        if (findUser.birthDate != null) {
          const dateNow = new Date().getTime();
          const dateOfBirth = new Date(findUser.birthDate).getTime();
          const timeRem = dateNow - dateOfBirth;
          const daysToDday = Math.floor(
            timeRem / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
          );
          const years = Math.floor(daysToDday / 365);
          console.log('years', years);

          if (years < 18) {
            await UserModel.findByIdAndUpdate(
              { _id: findUser.id },
              { $set: { isApproved: false } },
              { new: true },
            );

            //TODO: ADD DATA in array of not approved
            const findEventIdMinor = await EventModel.findOne({
              $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
            });
            if (!findEventIdMinor) {
              await EventModel.updateOne(
                { _id: req.params.id },
                {
                  $addToSet: {
                    subscriptionIds: req.body.userId,
                  },
                },
              );

              await AttendenceModel.findOneAndUpdate(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    present: req.body.userId,
                  },
                },
              );

              return successHandler(
                res,
                findEventIdMinor,
                'subsribed successfully is less  than 18 revelutuer will allow you.',
              );
            } else {
              return badRequestHandler(res, 'Already Subscribed');
            }

            return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
          }
          if (years >= 18) {
            const findEventsId = await EventModel.findOne({
              $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
            });
            if (!findEventsId) {
              await EventModel.updateOne(
                { _id: req.params.id },
                {
                  $addToSet: {
                    subscriptionIds: req.body.userId,
                  },
                },
              );

              await AttendenceModel.findOneAndUpdate(
                { eventId: req.params.id },
                {
                  $addToSet: {
                    present: req.body.userId,
                  },
                },
              );
              return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
            } else {
              return badRequestHandler(res, 'Already Subscribed');
            }
            // await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })
            // //TODO: ADD DATA in array of not approved
          } else {
            return badRequestHandler(res, 'Please update your profile');
          }
        } else {
          return badRequestHandler(res, 'Please update your profile');
        }
      }
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getSubsribeParticularEvent = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  // "eventName": null,
  // "eventImage": null,
  // "postalAddress
  // console.log("findSubscribeEvents", findSubscribeEvents);
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('req.params.id', req.params.id);
      const findSubscribeEvents = await EventModel.findOne({
        // subscriptionIds: [req.params.id],
        $and: [{ _id: req.params.id }, { subscriptionIds: { $in: [req.body.userId] } }],
      }).populate({
        path: 'subsIdAdminAndRevelature',
        select: ['firstName', 'lastName'],
      });
      // console.log("findSubscribeEvents",findSubscribeEvents)
      if (findSubscribeEvents) {
        const data: object = {
          eventId: findSubscribeEvents.id,
          userId: req.body.userId,
          subsIdAdminAndRevelature: findSubscribeEvents.subsIdAdminAndRevelature,
        };

        console.log('findSubscribeEvents', data);
        return successHandler(res, data, 'fetched subsribe event with that id');
      } else {
        // findSubscribeEvents?.subscribtionIds.filter(res=>{
        //   req.body.userId == res
        // })
        return badRequestHandler(res, 'events with that is not found');
      }
    } else {
      return badRequestHandler(res, 'id format is not correct');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};


export const getSubsribePastEvent = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.log('req.params.id', req.params.id);
    const findSubscribeEvents = await EventModel.find(
      // subscriptionIds: [req.params.id],
      { subscriptionIds: { $in: [req.params.id] },status:"finished" },
    ).populate({
      path: 'subsIdAdminAndRevelature',
      select: ['firstName', 'lastName'],
    });

    // "eventName": null,
    // "eventImage": null,
    // "postalAddress
    console.log('findSubscribeEvents', findSubscribeEvents);

      if (findSubscribeEvents.length < 0) {
        return badRequestHandler(res, 'events with that is not found');
      } else {
        return successHandler(res, findSubscribeEvents, 'fetched subsribe event with that id');
      }
    } else {
      return badRequestHandler(res, 'id format is not correct');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getSubsribeParticularEventStatus = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  // "eventName": null,
  // "eventImage": null,
  // "postalAddress
  // console.log("findSubscribeEvents", findSubscribeEvents);
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('req.params.id', req.params.id);
      const findSubscribeEvents = await EventModel.find({
        // subscriptionIds: [req.params.id],
        $and: [{ subscriptionIds: { $in: [req.params.id] } }, { status: 'finished' }],
      }).populate({
        path: 'subsIdAdminAndRevelature',
        select: ['firstName', 'lastName'],
      });
      // console.log("findSubscribeEvents",findSubscribeEvents)
      if (findSubscribeEvents) {
        // const data:object={
        //   eventId:findSubscribeEvents.id,
        //   userId:req.body.userId,
        //   subsIdAdminAndRevelature:findSubscribeEvents.subsIdAdminAndRevelature
        //  }

        console.log('findSubscribeEvents', findSubscribeEvents);
        return successHandler(res, findSubscribeEvents, 'fetched subsribe event with that id');
      } else {
        // findSubscribeEvents?.subscribtionIds.filter(res=>{
        //   req.body.userId == res
        // })
        return badRequestHandler(res, 'events with that is not found');
      }
    } else {
      return badRequestHandler(res, 'id format is not correct');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getUnsubscribeTalent = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findSubscribeEvents = await EventModel.findById(req.params.id);
      if (findSubscribeEvents) {
        const users = await UserModel.find({ _id: { $nin: findSubscribeEvents.subscriptionIds } });
        console.log('Users', users.length);
        return successHandler(res, users, 'Unsubscribed Talents fetched Successfully.');
      } else {
        return badRequestHandler(res, 'Event not found.');
      }
    } else {
      return badRequestHandler(res, 'id format is not correct');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

// $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }]

export const subscribeEventWithMinor = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    // const milliSecondsInASecond = 1000;
    // const hoursInADay = 24;
    // const minutesInAnHour = 60;
    // const SecondsInAMinute = 60;
    const findEvents = await EventModel.findOne({ _id: req.params.id });
    if (!findEvents) {
      return badRequestHandler(res, 'Event not found');
    }
    const findUser = await UserModel.findById(req.body.userId).populate('kiffs');
    if (!findUser) {
      return badRequestHandler(res, 'User not found');
    } else {
      if (findEvents.participationType === 'En présentiel') {
        // if(findUser.kiffs ==="En présentiel"){
        // }
      } else {
      }

      // console.log('User', findUser)
      // if (findUser.relatedRevelateur != null) {
      //   if (findUser.birthDate != null) {
      //     const dateNow = new Date().getTime()
      //     const dateOfBirth = new Date(findUser.birthDate).getTime()
      //     const timeRem = dateNow - dateOfBirth
      //     const daysToDday = Math.floor((timeRem) / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay));
      //     const years = Math.floor(daysToDday / 365)
      //     if (years < 18) {
      //       await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })

      //       //TODO: ADD DATA in array of not approved
      //       const findEventIdMinor = await EventModel.findOne({
      //         $and: [{ _id: req.params.id }, { subsribtionMinor: req.body.userId }],
      //       })
      //       if (!findEventIdMinor) {
      //         await EventModel.updateOne(
      //           { _id: req.params.id },
      //           {
      //             $addToSet: {
      //               subsribtionMinor: req.body.userId,
      //             },
      //           }
      //         );
      //         return successHandler(
      //           res,
      //           findEventIdMinor,
      //           "You're age is less  than 18 and in pending revelutuer  will allow you"
      //         );
      //       } else {
      //         return badRequestHandler(res, "Already Subscribed");
      //       }

      //       return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
      //     } else {
      //       const findEventsId = await EventModel.findOne({
      //         $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
      //       });
      //       if (!findEventsId) {
      //         await EventModel.updateOne(
      //           { _id: req.params.id },
      //           {
      //             $addToSet: {
      //               subscriptionIds: req.body.userId,
      //             },
      //           }
      //         );
      //         return successHandler(
      //           res,
      //           findEventsId,
      //           "Event Subscribed Sucessfully"
      //         );
      //       } else {
      //         return badRequestHandler(res, "Already Subscribed");
      //       }
      //     }
      //   } else {
      //     return badRequestHandler(res, "Please update your profile");
      //   }
      // } else {
      //   if (findUser.birthDate != null) {
      //     const dateNow = new Date().getTime()
      //     const dateOfBirth = new Date(findUser.birthDate).getTime()
      //     const timeRem = dateNow - dateOfBirth
      //     const daysToDday = Math.floor((timeRem) / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay));
      //     const years = Math.floor(daysToDday / 365)
      //     console.log("years", years)

      //     if (years < 18) {
      //       await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })

      //       //TODO: ADD DATA in array of not approved
      //       const findEventIdMinor = await EventModel.findOne({
      //         $and: [{ _id: req.params.id }, { subsribtionMinor: req.body.userId }],
      //       })
      //       if (!findEventIdMinor) {
      //         await EventModel.updateOne(
      //           { _id: req.params.id },
      //           {
      //             $addToSet: {
      //               subsribtionMinor: req.body.userId,
      //             },
      //           }
      //         );
      //         return successHandler(
      //           res,
      //           findEventIdMinor,
      //           "You're age is less  than 18 and in pending revelutuer  will allow you"
      //         );
      //       } else {
      //         return badRequestHandler(res, "Already Subscribed");
      //       }

      //       return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
      //     }
      //     if (years >= 18) {
      //       const findEventsId = await EventModel.findOne({
      //         $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
      //       });
      //       if (!findEventsId) {
      //         await EventModel.updateOne(
      //           { _id: req.params.id },
      //           {
      //             $addToSet: {
      //               subscriptionIds: req.body.userId,
      //             },
      //           }
      //         );
      //         return successHandler(
      //           res,
      //           findEventsId,
      //           "Event Subscribed Sucessfully"
      //         );
      //       } else {
      //         return badRequestHandler(res, "Already Subscribed");
      //       }
      //       // await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })
      //       // //TODO: ADD DATA in array of not approved
      //     } else {
      //       return badRequestHandler(res, "Please update your profile");
      //     }
      //   } else {
      //     return badRequestHandler(res, "Please update your profile");
      //   }
      // }
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};


export const eventStatusUpdate = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    // switch (req.body.status) {
    //   case 'declined': {
    //     console.log('HELLO Declined')
    //     const updateInvitation = await InvitationModel.findOneAndUpdate(
    //       {
    //         _id: req.params.id
    //       }
    //       ,
    //       {
    //         $set: {
    //           status: req.body.status,
    //         }
    //       }, { new: true })
    //     successHandler(res, { data: updateInvitation, success: true }, "Status updated successfully.");
    //     break;
    //   }
    //   case 'accepted': {
    //     const updateInvitation = await InvitationModel.findOneAndUpdate(
    //       {
    //         _id: req.params.id
    //       }
    //       ,
    //       {
    //         $set: {
    //           status: req.body.status,
    //         }
    //       }, { new: true })
    //     if (updateInvitation) {
    //       const findEventsId = await EventModel.findOne({
    //         $and: [{ _id: updateInvitation.eventId }, { subscriptionIds: { "$in": [updateInvitation.userId] } }],
    //       });
    //       if (!findEventsId) {
    //         await EventModel.updateOne(
    //           { _id: updateInvitation.eventId },
    //           {
    //             $addToSet: {
    //               subscriptionIds: updateInvitation.userId,
    //             },
    //           }
    //         );
    //         return successHandler(
    //           res,
    //           findEventsId,
    //           "events subscribe sucessfully"
    //         );
    //       } else {
    //         return badRequestHandler(res, "already subscribed");
    //       }
    //     } else {
    //       return badRequestHandler(res, "Something wrong in invitation");
    //     }
    //     break;
    //   }

    //   default: {
    //     badRequestHandler(res, `Invalid Status`);
    //     break;
    //   }
    // }

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {


      switch (req.body.status) {
        case 'finished': {
          console.log('finished')
          const updateInvitation = await EventModel.findOneAndUpdate(
            {
              _id: req.params.id
            }
            ,
            {
              $set: {
                status: req.body.status,
              }
            }, { new: true })

            await AttendenceModel.findOneAndUpdate(
              { eventId: req.params.id },
              { $set: { status: 'closed' } },
            );

           
          successHandler(res, { data: updateInvitation, success: true }, "Status updated successfully.");
          break;
        }
        case 'draft': {
          badRequestHandler(res, "accept only finished status");
          break;
        }


        case 'reported': {
          badRequestHandler(res, "accept only finished status");
          break;
        }

        case 'cancelled': {
          badRequestHandler(res, "accept only finished status");
          break;
        }

        case 'reported': {
          badRequestHandler(res, "accept only finished status");
          break;
        }
        default: {
          badRequestHandler(res, `Invalid Status`);
          break;
        }
      }

      // enum:['published','draft','reported','cancelled','finished'],
    }
    else {
      return badRequestHandler(res, 'please provid valid id format');
    }



  }
  catch (err) {
    return serverErrorHandler(res, err);
  }

}

// export const subscribeEventt = async (
//   req: express.Request,
//   res: express.Response,
// ): Promise<void> => {
//   try {
//     const milliSecondsInASecond = 1000;
//     const hoursInADay = 24;
//     const minutesInAnHour = 60;
//     const SecondsInAMinute = 60;
//     const findEvents = await EventModel.findOne({ _id: req.params.id });
//     if (!findEvents) {
//       return badRequestHandler(res, 'Event not found');
//     }
//     const findUser = await UserModel.findById(req.body.userId).populate('kiffs');
//     if (!findUser) {
//       return badRequestHandler(res, 'User not found');
//     } else {
//       const type = findEvents.participationType[0][0].distancielThumbnail;
//       const kiff = findUser.kiffs.filter((x) => {
//         return x.name.toLowerCase() === 'e-sport';
//       });

//       //   return badRequestHandler(
//       //     res,
//       //     `To register for this "E-sport" event,
//       // add the "E-sport" kiff and fill in your discor nickname`,
//       //   );

//       if (type === true) {
//         if (kiff.length > 0) {
//           if (findUser.relatedRevelateur != null) {
//             if (findUser.birthDate != null) {
//               // if(findUser.kiffs)
//               const dateNow = new Date().getTime();
//               const dateOfBirth = new Date(findUser.birthDate).getTime();
//               const timeRem = dateNow - dateOfBirth;
//               const daysToDday = Math.floor(
//                 timeRem /
//                   (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
//               );
//               const years = Math.floor(daysToDday / 365);
//               if (years < 18) {
//                 await UserModel.findByIdAndUpdate(
//                   { _id: findUser.id },
//                   { $set: { isApproved: false } },
//                   { new: true },
//                 );

//                 //TODO: ADD DATA in array of not approved
//                 const findEventIdMinor = await EventModel.findOne({
//                   $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//                 });
//                 if (!findEventIdMinor) {
//                   await EventModel.updateOne(
//                     { _id: req.params.id },
//                     {
//                       $addToSet: {
//                         subscriptionIds: req.body.userId,
//                       },
//                     },
//                   );
//                   return successHandler(
//                     res,
//                     findEventIdMinor,
//                     'subsribed successfully is less  than 18 revelutuer will allow you.',
//                   );
//                 } else {
//                   return badRequestHandler(res, 'Already Subscribed');
//                 }

//                 // return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
//               } else {
//                 const findEventsId = await EventModel.findOne({
//                   $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//                 });
//                 if (!findEventsId) {
//                   await EventModel.updateOne(
//                     { _id: req.params.id },
//                     {
//                       $addToSet: {
//                         subscriptionIds: req.body.userId,
//                       },
//                     },
//                   );
//                   return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
//                 } else {
//                   return badRequestHandler(res, 'Already Subscribed');
//                 }
//               }
//             } else {
//               return badRequestHandler(res, 'Please update your profile');
//             }
//           } else {
//             if (findUser.birthDate != null) {
//               const dateNow = new Date().getTime();
//               const dateOfBirth = new Date(findUser.birthDate).getTime();
//               const timeRem = dateNow - dateOfBirth;
//               const daysToDday = Math.floor(
//                 timeRem /
//                   (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
//               );
//               const years = Math.floor(daysToDday / 365);
//               console.log('years', years);

//               if (years < 18) {
//                 await UserModel.findByIdAndUpdate(
//                   { _id: findUser.id },
//                   { $set: { isApproved: false } },
//                   { new: true },
//                 );

//                 //TODO: ADD DATA in array of not approved
//                 const findEventIdMinor = await EventModel.findOne({
//                   $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//                 });
//                 if (!findEventIdMinor) {
//                   await EventModel.updateOne(
//                     { _id: req.params.id },
//                     {
//                       $addToSet: {
//                         subscriptionIds: req.body.userId,
//                       },
//                     },
//                   );
//                   return successHandler(
//                     res,
//                     findEventIdMinor,
//                     'subsribed successfully is less  than 18 revelutuer will allow you.',
//                   );
//                 } else {
//                   return badRequestHandler(res, 'Already Subscribed');
//                 }

//                 return badRequestHandler(
//                   res,
//                   "You're age is less  than 18 revelutuer will allow you.",
//                 );
//               }
//               if (years >= 18) {
//                 const findEventsId = await EventModel.findOne({
//                   $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//                 });
//                 if (!findEventsId) {
//                   await EventModel.updateOne(
//                     { _id: req.params.id },
//                     {
//                       $addToSet: {
//                         subscriptionIds: req.body.userId,
//                       },
//                     },
//                   );
//                   return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
//                 } else {
//                   return badRequestHandler(res, 'Already Subscribed');
//                 }
//                 // await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })
//                 // //TODO: ADD DATA in array of not approved
//               } else {
//                 return badRequestHandler(res, 'Please update your profile');
//               }
//             } else {
//               return badRequestHandler(res, 'Please update your profile');
//             }
//           }
//         } else {
//           return badRequestHandler(
//             res,
//             `To register for this "E-sport" event, add the "E-sport" kiff and fill in your discor nickname`,
//           );
//         //   if (findEvents.participationType[0][0].distancielThumbnail === true) {
//         //     if (findUser.relatedRevelateur != null) {
//         //       if (findUser.birthDate != null) {
//         //         // if(findUser.kiffs)
//         //         const dateNow = new Date().getTime();
//         //         const dateOfBirth = new Date(findUser.birthDate).getTime();
//         //         const timeRem = dateNow - dateOfBirth;
//         //         const daysToDday = Math.floor(
//         //           timeRem /
//         //             (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
//         //         );
//         //         const years = Math.floor(daysToDday / 365);
//         //         if (years < 18) {
//         //           await UserModel.findByIdAndUpdate(
//         //             { _id: findUser.id },
//         //             { $set: { isApproved: false } },
//         //             { new: true },
//         //           );

//         //           //TODO: ADD DATA in array of not approved
//         //           const findEventIdMinor = await EventModel.findOne({
//         //             $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//         //           });
//         //           if (!findEventIdMinor) {
//         //             await EventModel.updateOne(
//         //               { _id: req.params.id },
//         //               {
//         //                 $addToSet: {
//         //                   subscriptionIds: req.body.userId,
//         //                 },
//         //               },
//         //             );
//         //             return successHandler(
//         //               res,
//         //               findEventIdMinor,
//         //               'subsribed successfully is less  than 18 revelutuer will allow you.',
//         //             );
//         //           } else {
//         //             return badRequestHandler(res, 'Already Subscribed');
//         //           }

//         //           // return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
//         //         } else {
//         //           const findEventsId = await EventModel.findOne({
//         //             $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//         //           });
//         //           if (!findEventsId) {
//         //             await EventModel.updateOne(
//         //               { _id: req.params.id },
//         //               {
//         //                 $addToSet: {
//         //                   subscriptionIds: req.body.userId,
//         //                 },
//         //               },
//         //             );
//         //             return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
//         //           } else {
//         //             return badRequestHandler(res, 'Already Subscribed');
//         //           }
//         //         }
//         //       } else {
//         //         return badRequestHandler(res, 'Please update your profile');
//         //       }
//         //     } else {
//         //       if (findUser.birthDate != null) {
//         //         const dateNow = new Date().getTime();
//         //         const dateOfBirth = new Date(findUser.birthDate).getTime();
//         //         const timeRem = dateNow - dateOfBirth;
//         //         const daysToDday = Math.floor(
//         //           timeRem /
//         //             (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
//         //         );
//         //         const years = Math.floor(daysToDday / 365);
//         //         console.log('years', years);

//         //         if (years < 18) {
//         //           await UserModel.findByIdAndUpdate(
//         //             { _id: findUser.id },
//         //             { $set: { isApproved: false } },
//         //             { new: true },
//         //           );

//         //           //TODO: ADD DATA in array of not approved
//         //           const findEventIdMinor = await EventModel.findOne({
//         //             $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//         //           });
//         //           if (!findEventIdMinor) {
//         //             await EventModel.updateOne(
//         //               { _id: req.params.id },
//         //               {
//         //                 $addToSet: {
//         //                   subscriptionIds: req.body.userId,
//         //                 },
//         //               },
//         //             );
//         //             return successHandler(
//         //               res,
//         //               findEventIdMinor,
//         //               'subsribed successfully is less  than 18 revelutuer will allow you.',
//         //             );
//         //           } else {
//         //             return badRequestHandler(res, 'Already Subscribed');
//         //           }

//         //           return badRequestHandler(
//         //             res,
//         //             "You're age is less  than 18 revelutuer will allow you.",
//         //           );
//         //         }
//         //         if (years >= 18) {
//         //           const findEventsId = await EventModel.findOne({
//         //             $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//         //           });
//         //           if (!findEventsId) {
//         //             await EventModel.updateOne(
//         //               { _id: req.params.id },
//         //               {
//         //                 $addToSet: {
//         //                   subscriptionIds: req.body.userId,
//         //                 },
//         //               },
//         //             );
//         //             return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
//         //           } else {
//         //             return badRequestHandler(res, 'Already Subscribed');
//         //           }
//         //           // await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })
//         //           // //TODO: ADD DATA in array of not approved
//         //         } else {
//         //           return badRequestHandler(res, 'Please update your profile');
//         //         }
//         //       } else {
//         //         return badRequestHandler(res, 'Please update your profile');
//         //       }
//         //     }
//         //   } else {
//         //     return badRequestHandler(
//         //       res,
//         //       `To register for this "E-sport" event, add the "E-sport" kiff and fill in your discor nickname`,
//         //     );
//         //   }
//         }
//       } else {
//         if (findUser.relatedRevelateur != null) {
//           if (findUser.birthDate != null) {
//             // if(findUser.kiffs)
//             const dateNow = new Date().getTime();
//             const dateOfBirth = new Date(findUser.birthDate).getTime();
//             const timeRem = dateNow - dateOfBirth;
//             const daysToDday = Math.floor(
//               timeRem / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
//             );
//             const years = Math.floor(daysToDday / 365);
//             if (years < 18) {
//               await UserModel.findByIdAndUpdate(
//                 { _id: findUser.id },
//                 { $set: { isApproved: false } },
//                 { new: true },
//               );

//               //TODO: ADD DATA in array of not approved
//               const findEventIdMinor = await EventModel.findOne({
//                 $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//               });
//               if (!findEventIdMinor) {
//                 await EventModel.updateOne(
//                   { _id: req.params.id },
//                   {
//                     $addToSet: {
//                       subscriptionIds: req.body.userId,
//                     },
//                   },
//                 );
//                 return successHandler(
//                   res,
//                   findEventIdMinor,
//                   'subsribed successfully is less  than 18 revelutuer will allow you.',
//                 );
//               } else {
//                 return badRequestHandler(res, 'Already Subscribed');
//               }

//               // return badRequestHandler(res, "You're age is less  than 18 revelutuer will allow you.");
//             } else {
//               const findEventsId = await EventModel.findOne({
//                 $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//               });
//               if (!findEventsId) {
//                 await EventModel.updateOne(
//                   { _id: req.params.id },
//                   {
//                     $addToSet: {
//                       subscriptionIds: req.body.userId,
//                     },
//                   },
//                 );
//                 return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
//               } else {
//                 return badRequestHandler(res, 'Already Subscribed');
//               }
//             }
//           } else {
//             return badRequestHandler(res, 'Please update your profile');
//           }
//         } else {
//           if (findUser.birthDate != null) {
//             const dateNow = new Date().getTime();
//             const dateOfBirth = new Date(findUser.birthDate).getTime();
//             const timeRem = dateNow - dateOfBirth;
//             const daysToDday = Math.floor(
//               timeRem / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
//             );
//             const years = Math.floor(daysToDday / 365);
//             console.log('years', years);

//             if (years < 18) {
//               await UserModel.findByIdAndUpdate(
//                 { _id: findUser.id },
//                 { $set: { isApproved: false } },
//                 { new: true },
//               );

//               //TODO: ADD DATA in array of not approved
//               const findEventIdMinor = await EventModel.findOne({
//                 $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//               });
//               if (!findEventIdMinor) {
//                 await EventModel.updateOne(
//                   { _id: req.params.id },
//                   {
//                     $addToSet: {
//                       subscriptionIds: req.body.userId,
//                     },
//                   },
//                 );
//                 return successHandler(
//                   res,
//                   findEventIdMinor,
//                   'subsribed successfully is less  than 18 revelutuer will allow you.',
//                 );
//               } else {
//                 return badRequestHandler(res, 'Already Subscribed');
//               }

//               return badRequestHandler(
//                 res,
//                 "You're age is less  than 18 revelutuer will allow you.",
//               );
//             }
//             if (years >= 18) {
//               const findEventsId = await EventModel.findOne({
//                 $and: [{ _id: req.params.id }, { subscriptionIds: req.body.userId }],
//               });
//               if (!findEventsId) {
//                 await EventModel.updateOne(
//                   { _id: req.params.id },
//                   {
//                     $addToSet: {
//                       subscriptionIds: req.body.userId,
//                     },
//                   },
//                 );
//                 return successHandler(res, findEventsId, 'Event Subscribed Sucessfully');
//               } else {
//                 return badRequestHandler(res, 'Already Subscribed');
//               }
//               // await UserModel.findByIdAndUpdate({ _id: findUser.id }, { $set: { isApproved: false } }, { new: true })
//               // //TODO: ADD DATA in array of not approved
//             } else {
//               return badRequestHandler(res, 'Please update your profile');
//             }
//           } else {
//             return badRequestHandler(res, 'Please update your profile');
//           }
//         }
//       }
//     }
//   } catch (err) {
//     return serverErrorHandler(res, err);
//   }
// };
